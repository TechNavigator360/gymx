BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password_hash] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[TrainingSession] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    CONSTRAINT [TrainingSession_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[WeeklyGoal] (
    [user_id] INT NOT NULL,
    [target_sessions] INT NOT NULL,
    CONSTRAINT [WeeklyGoal_pkey] PRIMARY KEY CLUSTERED ([user_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [TrainingSession_user_id_idx] ON [dbo].[TrainingSession]([user_id]);

-- AddForeignKey
ALTER TABLE [dbo].[TrainingSession] ADD CONSTRAINT [TrainingSession_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[WeeklyGoal] ADD CONSTRAINT [WeeklyGoal_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
