#!/bin/bash

# BugHawk Setup Script
# This script sets up the complete development environment for BugHawk

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
print_banner() {
    echo -e "${BLUE}"
    cat << "EOF"
    ____             _   _                   _    
   |  _ \           | | | |                 | |   
   | |_) |_   _  __ | |_| | __ ___      __ | | __
   |  _ <| | | |/ _|| __| |/ // _ \\ /\ / / | |/ /
   | |_) | |_| | (_|| |_| |   / (_) \\ V /  |   < 
   |____/ \\__,_|\\__, |\\__|_|\\_\\\\___/ \\_/   |_|\\_\\
                 __/ |                          
                |___/                           
EOF
    echo -e "${NC}"
    echo -e "${GREEN}Enterprise SaaS Bug Tracking Platform${NC}"
    echo -e "${BLUE}Setting up your development environment...${NC}\n"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_warning "Docker is not installed. Some features will not be available."
        log_warning "Install Docker from https://docs.docker.com/get-docker/"
    else
        if ! docker info &> /dev/null; then
            log_warning "Docker is not running. Please start Docker."
        fi
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
        log_warning "Docker Compose is not installed. Some features will not be available."
    fi
    
    log_success "Prerequisites check completed"
}

# Setup environment variables
setup_environment() {
    log_info "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        log_success "Created .env file from .env.example"
        log_warning "Please update the .env file with your specific configuration"
    else
        log_info ".env file already exists"
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install and build shared package
    log_info "Building shared package..."
    npm run build --workspace=packages/shared
    
    log_success "Dependencies installed successfully"
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        log_info "Starting database services with Docker..."
        docker-compose up -d postgres redis elasticsearch
        
        # Wait for database to be ready
        log_info "Waiting for database to be ready..."
        sleep 10
        
        # Run database migrations
        log_info "Running database migrations..."
        cd apps/api
        npx prisma migrate dev --name init
        npx prisma generate
        
        # Seed database
        log_info "Seeding database with sample data..."
        npm run db:seed
        
        cd ../..
        log_success "Database setup completed"
    else
        log_warning "Docker not available. Please manually setup PostgreSQL, Redis, and Elasticsearch"
        log_info "Update your .env file with the connection details"
    fi
}

# Setup development tools
setup_dev_tools() {
    log_info "Setting up development tools..."
    
    # Setup Git hooks
    if [ -d .git ]; then
        npx husky install
        log_success "Git hooks configured"
    else
        log_warning "Not a Git repository. Skipping Git hooks setup"
    fi
    
    # Setup VS Code settings
    if [ ! -d .vscode ]; then
        mkdir -p .vscode
        cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  }
}
EOF
        
        cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
EOF
        log_success "VS Code configuration created"
    fi
}

# Build applications
build_applications() {
    log_info "Building applications..."
    
    # Build API
    log_info "Building API..."
    npm run build --workspace=apps/api
    
    # Build Web
    log_info "Building Web application..."
    npm run build --workspace=apps/web
    
    # Build CLI
    log_info "Building CLI tool..."
    npm run build --workspace=apps/cli
    
    log_success "All applications built successfully"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Run shared package tests
    npm run test --workspace=packages/shared
    
    # Run API tests (if database is available)
    if docker ps | grep -q bughawk-postgres; then
        npm run test --workspace=apps/api
    else
        log_warning "Database not available. Skipping API tests"
    fi
    
    # Run Web tests
    npm run test --workspace=apps/web
    
    log_success "Tests completed"
}

# Start development servers
start_development() {
    log_info "Starting development environment..."
    
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        log_info "Starting all services..."
        docker-compose up -d
        
        log_info "Waiting for services to be ready..."
        sleep 15
        
        log_success "Development environment is ready!"
        echo ""
        log_info "Available services:"
        echo "  🚀 API: http://localhost:3000"
        echo "  📖 API Docs: http://localhost:3000/api/docs"
        echo "  🖥️  Web App: http://localhost:3001"
        echo "  📊 Grafana: http://localhost:3002 (admin/admin)"
        echo "  🔍 Prometheus: http://localhost:9090"
        echo "  📧 MailHog: http://localhost:8025"
        echo "  🗃️  MinIO: http://localhost:9001 (minioadmin/minioadmin123)"
        echo ""
        log_info "To view logs: docker-compose logs -f"
        log_info "To stop: docker-compose down"
    else
        log_warning "Docker not available. Please start services manually"
        log_info "1. Start PostgreSQL, Redis, and Elasticsearch"
        log_info "2. Run: npm run dev"
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    docker-compose down &> /dev/null || true
}

# Main setup function
main() {
    print_banner
    
    # Parse command line arguments
    SKIP_TESTS=false
    SKIP_BUILD=false
    SKIP_START=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-start)
                SKIP_START=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --skip-tests    Skip running tests"
                echo "  --skip-build    Skip building applications"
                echo "  --skip-start    Skip starting development environment"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Setup steps
    check_prerequisites
    setup_environment
    install_dependencies
    setup_database
    setup_dev_tools
    
    if [ "$SKIP_BUILD" = false ]; then
        build_applications
    fi
    
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    fi
    
    if [ "$SKIP_START" = false ]; then
        start_development
    fi
    
    log_success "Setup completed successfully! 🎉"
    echo ""
    log_info "Next steps:"
    echo "  1. Update the .env file with your configuration"
    echo "  2. Check the documentation in docs/"
    echo "  3. Start coding! 💻"
    echo ""
    log_info "Useful commands:"
    echo "  npm run dev          - Start development servers"
    echo "  npm run test         - Run tests"
    echo "  npm run lint         - Run linting"
    echo "  npm run build        - Build for production"
    echo "  docker-compose logs  - View service logs"
}

# Trap to cleanup on script exit
trap cleanup EXIT

# Run main function
main "$@"