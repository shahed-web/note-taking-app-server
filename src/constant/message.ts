export const AUTH_MESSAGES = {
    REGISTER: {
        SUCCESS: "User registered successfully",
        FAILED: "Registration unsuccessful",
        EXISTS: "User exists"
    },
    LOGIN: {
        SUCCESS: "Login successful",
        FAILED: "Login failed",
        INVALID_CREDENTIALS: "Invalid email or password"
    },
    LOGOUT: {
        SUCCESS: "Logout successful",
        FAILED: "Logout failed"
    },
    AUTHORIZE: {
        SUCCESS: "Authorized",
        FAILED: "Unauthorized",
        EXPIRED: "Token expired",
        FORBIDDEN: "Forbidden",
        INVALID_TOKEN: "Invalid token",
        INVALID_SESSION: "Invalid session",
        AUTH_REQUIRED: "Authentication required"
    }
}

export const NOTE_MESSAGES = {
    CREATE: {
        SUCCESS: "Note created successfully",
        FAILED: "Failed to create note"
    },
    GET : {
        SUCCESS: "Notes retrieved successfully",
        FAILED: "Failed to retrieve notes",
        NOT_FOUND: "Note not found"
    },
    UPDATE : {
        SUCCESS: "Note updated successfully",
        FAILED: "Failed to update notes"
    },
    DELETE : {
        SUCCESS: "Note deleted successfully",
        FAILED: "Failed to delete notes"
    }
}

export const USER_MESSAGES = {
    GET : {
        SUCCESS: "User retrieved successfully",
        FAILED: "Failed to retrieve user",
        NOT_FOUND: "User not found"
    },
    GROUP : {
        SUCCESS: "User grouped by interest successfully",
        FAILED: "Failed to group user",
        NOT_FOUND: "User not found"
    },
    UPDATE : {
        SUCCESS: "User updated successfully",
        FAILED: "Failed to update user"
    },
    DELETE : {
        SUCCESS: "User deleted successfully",
        FAILED: "Failed to delete user"
    }
}
