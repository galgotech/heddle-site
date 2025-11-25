# Fhub Database Schema

This document defines the database schema for the Fhub platform. The schema is designed to be relational and is described here using SQL syntax (PostgreSQL).

## 1. Users

The `users` table stores information about registered users.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    reputation_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Functions

The `functions` table stores metadata about each function. Each function is a distinct entity, with versions tracked in a separate table.

```sql
CREATE TABLE functions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (owner_id, name)
);
```

## 3. Function Versions

The `function_versions` table stores the code and metadata for each version of a function.

```sql
CREATE TABLE function_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES functions(id),
    version VARCHAR(255) NOT NULL, -- SemVer
    code_path VARCHAR(255) NOT NULL, -- Path to code in object storage
    runtime VARCHAR(255) NOT NULL, -- e.g., "nodejs", "python"
    input_signature JSONB,
    output_signature JSONB,
    readme TEXT, -- Auto-generated documentation
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (function_id, version)
);
```

## 4. Dependencies

The `function_dependencies` table tracks the dependencies between functions.

```sql
CREATE TABLE function_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES function_versions(id),
    depends_on_function_id UUID NOT NULL REFERENCES functions(id),
    version_constraint VARCHAR(255) NOT NULL -- e.g., "^1.2.3"
);
```

## 5. Issues and Discussions

The `discussions` table stores conversations related to specific function versions.

```sql
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES function_versions(id),
    author_id UUID NOT NULL REFERENCES users(id),
    parent_id UUID REFERENCES discussions(id), -- For threaded conversations
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 6. API Endpoints

The `api_endpoints` table stores the generated HTTPS endpoints for each function version.

```sql
CREATE TABLE api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES function_versions(id),
    url VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 7. Environment Variables

The `environment_variables` table stores encrypted secrets and configuration variables for functions.

```sql
CREATE TABLE environment_variables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES functions(id),
    key VARCHAR(255) NOT NULL,
    value_encrypted TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (function_id, key)
);
```
