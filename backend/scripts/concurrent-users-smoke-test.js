const BASE_URL = "https://gymx-backend-24015067.azurewebsites.net";
const USER_COUNT = 10;

async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    const text = await response.text();

    let body;
    try {
        body = text ? JSON.parse(text) : {};
    } catch {
        body = text;
    }

    return {
        status: response.status,
        body,
    };
}

async function simulateUser(index) {
    const email = `loadtest_user_${Date.now()}_${index}@gymx.test`;
    const password = "Password123!";

    const register = await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    const login = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    const token = login.body.token;

    if (!token) {
        return {
            user: index,
            register: register.status,
            login: login.status,
            createSession: "NO_TOKEN",
        };
    }

    const session = await request("/api/sessions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: "2026-05-28" }),
    });

    if (session.status !== 201) {
        console.log(`User ${index} session failed:`, {
            status: session.status,
            body: session.body,
            tokenExists: Boolean(token),
            tokenPreview: token ? token.substring(0, 20) : null,
        });
    }

    return {
        user: index,
        register: register.status,
        login: login.status,
        createSession: session.status,
    };
}

async function main() {
    console.log(`Running concurrent smoke test with ${USER_COUNT} simulated user(s)...`);

    const results = await Promise.all(
        Array.from({ length: USER_COUNT }, (_, index) => simulateUser(index + 1))
    );

    console.table(results);

    const failed = results.filter(result =>
        result.register !== 201 ||
        result.login !== 200 ||
        result.createSession !== 201
    );

    if (failed.length > 0) {
        console.error("Concurrent smoke test failed.");
        process.exit(1);
    }

    console.log("Concurrent smoke test passed.");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});