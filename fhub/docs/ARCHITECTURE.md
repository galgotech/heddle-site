# Fhub Architecture Overview

This document outlines the high-level architecture for Fhub, a platform for managing and sharing individual functions.

## 1. Core Principles

- **Microservices:** The backend is designed as a set of loosely-coupled microservices, each responsible for a specific domain (e.g., API, runner, auth).
- **Scalability:** The architecture is designed to scale horizontally to handle a large number of users and function executions.
- **Security:** Security is a primary concern, with a focus on sandboxing function executions and protecting user data.

## 2. System Components

The Fhub platform is composed of three main components:

- **Backend:** A set of Go microservices that provide the core functionality of the platform.
- **Storage:** A combination of a relational database and an object store to persist data.
- **Runner Service:** A dedicated service for executing user-submitted functions in a sandboxed environment.

### 2.1. Backend Services

The backend is composed of the following microservices:

- **API Gateway:** The single entry point for all client requests. It routes requests to the appropriate microservice and handles concerns like authentication and rate limiting.
- **Function Service:** Manages the lifecycle of functions, including creation, versioning, and deletion.
- **User Service:** Handles user authentication, authorization, and profile management.
- **Search Service:** Provides advanced search capabilities, including signature and semantic search.
- **Marketplace Service:** Manages the monetization features of the platform, including private registries and the function marketplace.

### 2.2. Storage

- **Database:** A PostgreSQL database is used to store structured data like user information, function metadata, and dependency graphs.
- **Object Storage:** An S3-compatible object store is used to store function code, documentation, and other large files.

### 2.3. Runner Service

The Runner Service is responsible for executing functions in a secure and isolated environment.

- **Sandboxing:** Each function is executed in a dedicated, short-lived container (e.g., Docker or Firecracker) to prevent it from accessing the host system or other functions.
- **Polyglot Support:** The runner service uses different container images for each supported language, with the appropriate runtime and dependencies pre-installed.
- **Scalability:** The runner service is designed to scale horizontally, with a queue-based system to manage function execution requests.

## 3. Technology Stack

- **Backend:** Go
- **Frontend:** React, TypeScript
- **Database:** PostgreSQL
- **Object Storage:** MinIO (or any S3-compatible service)
- **Containerization:** Docker
- **Orchestration:** Kubernetes (optional, for production deployments)
- **API Gateway:** Traefik or a custom Go implementation.
