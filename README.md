# Math Problem Generator

A comprehensive tool for generating, managing, and deploying customizable math problems for educational purposes.

## Project Overview

The Math Problem Generator is an intelligent system designed to create diverse mathematical problems across various difficulty levels and topics. This tool serves educators, students, and tutoring platforms by providing dynamically generated problem sets that can be customized based on specific learning objectives.

Whether you're building quiz systems, practice problem sets, or adaptive learning platforms, the Math Problem Generator offers a flexible and scalable solution for mathematical content generation.

## Features

- **Dynamic Problem Generation**: Automatically generates problems across multiple mathematical domains
- **Customizable Difficulty Levels**: Problems can be generated at different complexity levels (basic, intermediate, advanced)
- **Multiple Problem Types**: Support for various mathematical problem categories including:
  - Arithmetic operations
  - Algebra
  - Geometry
  - Trigonometry
  - Calculus
- **Solution Generation**: Automatically generates detailed solutions for each problem
- **Batch Processing**: Generate multiple problems in a single request
- **Configurable Parameters**: Fine-tune problem generation with custom parameters
- **Problem Validation**: Built-in validation to ensure problem correctness and quality
- **Export Functionality**: Export problems in multiple formats (JSON, PDF, etc.)

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ethanm2791-wq/math-problem-generator.git
   cd math-problem-generator
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Quick Start

1. **Configure the application** (optional)
   - Copy `config.example.yml` to `config.yml` and customize as needed

2. **Run the generator**
   ```bash
   python main.py
   ```

3. **Using as a module**
   ```python
   from math_problem_generator import ProblemGenerator
   
   generator = ProblemGenerator()
   problem = generator.generate(
       topic='algebra',
       difficulty='intermediate',
       problem_type='linear_equations'
   )
   print(problem)
   ```

## Architecture

### Directory Structure

```
math-problem-generator/
├── src/
│   ├── generators/           # Problem generation modules
│   │   ├── arithmetic.py
│   │   ├── algebra.py
│   │   ├── geometry.py
│   │   └── base_generator.py
│   ├── solvers/              # Solution generation modules
│   │   ├── solver.py
│   │   └── step_solver.py
│   ├── validators/           # Problem validation
│   │   └── validator.py
│   ├── exporters/            # Export format handlers
│   │   ├── json_exporter.py
│   │   └── pdf_exporter.py
│   └── utils/                # Utility functions
│       └── constants.py
├── tests/                    # Unit and integration tests
├── config/                   # Configuration files
├── docs/                     # Documentation
├── main.py                   # Application entry point
├── requirements.txt          # Project dependencies
└── README.md                 # This file
```

### Core Components

1. **Generators**: Base classes and implementations for different mathematical domains. Each generator inherits from `BaseGenerator` and implements problem generation logic.

2. **Solvers**: Responsible for computing solutions and generating step-by-step explanations for generated problems.

3. **Validators**: Ensure generated problems meet quality standards, including correctness, clarity, and appropriate difficulty levels.

4. **Exporters**: Handle conversion of problems to various output formats for different use cases.

5. **Utilities**: Common functions and constants used across the application.

### Data Flow

```
User Request
    ↓
Configuration Parsing
    ↓
Problem Generation
    ↓
Solution Generation
    ↓
Validation
    ↓
Formatting/Export
    ↓
Output
```

## Deployment Guide

### Development Deployment

1. **Set environment variables**
   ```bash
   export FLASK_ENV=development
   export DEBUG=True
   ```

2. **Run development server**
   ```bash
   python main.py --dev
   ```

### Production Deployment

#### Option 1: Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t math-problem-generator:latest .
   ```

2. **Run Docker container**
   ```bash
   docker run -p 5000:5000 \
     -e FLASK_ENV=production \
     math-problem-generator:latest
   ```

#### Option 2: Traditional Server Deployment

1. **Install production dependencies**
   ```bash
   pip install gunicorn
   pip install -r requirements.txt
   ```

2. **Run with Gunicorn**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 main:app
   ```

3. **Configure Nginx** (recommended)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Environment Configuration

Create a `.env` file in the project root:

```env
FLASK_ENV=production
DEBUG=False
LOG_LEVEL=INFO
DATABASE_URL=postgresql://user:password@localhost/dbname
CACHE_TYPE=redis
REDIS_URL=redis://localhost:6379/0
API_RATE_LIMIT=1000
```

### Database Setup

1. **Initialize database** (if applicable)
   ```bash
   python scripts/init_db.py
   ```

2. **Run migrations**
   ```bash
   python scripts/migrate.py
   ```

### Monitoring and Logging

- Logs are stored in `logs/` directory
- Configure log rotation in production
- Monitor application health using provided health check endpoint: `/health`
- Set up alerts for error rates and performance metrics

### Security Best Practices

- Keep dependencies updated: `pip install --upgrade -r requirements.txt`
- Use HTTPS in production
- Set strong environment variable values
- Implement rate limiting (configured via `API_RATE_LIMIT`)
- Regular security audits and dependency scanning

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository or contact the maintainers.

---

**Last Updated**: 2025-12-10

**Maintained by**: ethanm2791-wq
