# =========================
# 1️⃣ Backend Build Stage (.NET API)
# =========================

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-backend
WORKDIR /src
# - Uses the .NET SDK image to compile your backend.
# - Sets the working directory to /src.

COPY blog-app.sln ./
COPY BlogAPI/BlogAPI.csproj BlogAPI/
RUN dotnet restore
# - Copies the solution and project files.
# - Runs dotnet restore to fetch dependencies.

COPY . .
RUN dotnet publish BlogAPI/BlogAPI.csproj -c Release -o /app/publish
# - Copies the full source code.
# - Publishes the backend to /app/publish (optimized for production).


# =========================
# 2️⃣ Frontend Build Stage (Vite React)
# =========================
FROM node:20 AS build-frontend
WORKDIR /app

# Copy and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy all frontend files and build
COPY client/ ./
RUN npm run build

# =========================
# 3️⃣ Final Stage (API + Static Frontend)
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy backend publish output
COPY --from=build-backend /app/publish ./

# Create wwwroot and copy frontend build
RUN mkdir -p wwwroot
COPY --from=build-frontend /app/dist ./wwwroot

# Expose ports
EXPOSE 8080

# Run API
ENTRYPOINT ["dotnet", "BlogAPI.dll"]

