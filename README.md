# LabelStack

LabelStack is a prototype medical image annotation platform that helps healthcare professionals and researchers analyze and manually label medical images. It provides tools for viewing different types of medical images (like X-rays, CT scans, and MRIs), adding detailed annotations, and managing annotation tasks within a team. The platform makes it easy to store, access, and work with medical images while keeping track of all labeling work in an organized way.

The platform enables administrators to assign and monitor tasks while annotators focus on labeling work. Key features include image manipulation tools, annotation capabilities, and task management. This prototype demonstrated core functionality but is no longer actively maintained.

## Features

### Image Viewing
LabelStack provides medical image viewing capabilities that support most of DICOM modalities including X-Ray (CR, DR), Computed Tomography (CT), Magnetic Resonance Imaging (MRI) and Ultrasound. Users can view images in multiple configurations with single, two, or three slice views, as well as 3D visualization. The viewer includes image manipulation tools such as window/level adjustment for optimal contrast, pan, zoom, slice navigation and image inversion.

### Annotation Tools
The platform offers a set of annotation tools designed for precise medical image marking. Users can create annotations using a brush tool for freehand marking, a polygon tool, or a spline tool for curved structure annotation. To ensure work is never lost, the system includes an auto-save feature.

### Task Management And System Administration Tools
The platform has a simple management application where admins can manage tasks, labels, users and images. Regular users with "annotator" role can manage and launch assigned tasks.

The main screen shows a list of all tasks where admins can create and assign them to users through a simple form. They can edit multiple tasks at the same time and see how each task is progressing. The system allows setting task importance and due dates, and users can find specific tasks using search boxes and filters.

Users can create new labels and assign them directly to selected images. Administrators can add new users to the system and set what they're allowed to do. Admins can see what work users are doing and track how much work each person completes. The management screen uses clear menus that are easy to understand.


### DICOM Integration
The platform integrates with DICOM systems through DICOMweb support, providing native compatibility with medical imaging standards. It includes built-in integration with the Orthanc PACS server for efficient image storage and retrieval. Users can view and access DICOM metadata directly within the interface, while the system maintains efficient image loading and caching mechanisms to ensure smooth performance.

### Task and Data Flow

#### 1. Image Upload and Storage
1. DICOM images are uploaded to the Orthanc PACS server
2. Images are stored with their metadata and can be accessed within the application

#### 2. Labeling Process
1. Task administrator [creates a labeling task](docs/images/workflow_0/0_create_label_task)
   and [assigns it](/docs/images/workflow_0/1_assign_labels) using annotation application
   or assings a label directly to selected group of images
2. Label assignments are created for:
   - Specific image instances
   - Image series
3. Label task workflow:
   - Unassigned → Open → In Progress → Done
   - Tasks can be cancelled at any stage
4. Each label assignment includes:
   - Reference to the image instance
   - Label definition

#### 3. Annotation Task Creation
1. Task administrator [creates an annotation task](docs/images/workflow_0/2_create_annotate_task)
2. Task is assigned to one annotator
3. Task status follows the workflow:
   - Unassigned → Open → In Progress → Done
   - Tasks can be cancelled at any stage
4. Each task includes:
   - Task metadata (name, description, priority)
   - Assigned user
   - Associated image instances or previously created label assignments

#### 4. [Annotation Process](docs/images/workflow_0/3_annotate)
1. Annotator opens the task in the viewer interface
2. Available tools for annotation:
   - Brush tool for freehand annotations
   - Polygon tool for precise boundary marking
   - Spline tool for curved annotations
3. Annotations are saved with:
   - Version control
   - Time tracking
   - Author information
   - Associated metadata
4. Auto-save feature ensures work is not lost

#### 5. [Review Process](docs/images/workflow_0/5_review)
1. Task administrator [creates a review task](docs/images/workflow_0/4_create_review_task) for completed annotations
2. Review task workflow:
   - Unassigned → Open → In Progress → Done
   - Each annotation requires review
3. Reviewers can:
   - Accept annotations as is
   - Request corrections
   - Add comments
4. Review results:
   - Accepted annotations are marked as final
   - Denied annotations require correction and new version
   - Review history is maintained with sequence numbers


## Tech Stack

### Frontend
React.js | TypeScript | VTK.js | Cornerstone.js | TailwindCSS | Webpack

### Backend
FastAPI (Python) | PostgreSQL + SQLAlchemy | Orthanc

### Orchestration
Docker Compose | Traefik

## Project Structure and Architecture

### Project Organization
```
labelstack/
├── backend/               # FastAPI backend service
│   └── app/
│       ├── api/           # API endpoints and routes
│       ├── core/          # Core configurations and business logic
│       ├── crud/          # Database CRUD operations
│       ├── models/        # Database models
│       ├── schemas/       # Pydantic schemas for data validation
│       ├── resources/     # Static resources and constants
│       └── utils/         # Utility functions
├── webapp/                # Frontend monorepo
│   └── packages/
│       ├── app/           # Main application package
│       ├── viewer/        # Medical image viewer component
│       ├── annotator/     # Annotation tools and functionality
│       └── api/           # Frontend API client
├── pacs/                  # Orthanc PACS server configuration
├── database/              # Database initialization utilities
└── docker-compose.yml     # Container orchestration
```

### Architecture Overview

#### Frontend Architecture
The frontend is organized as a monorepo using Lerna, with the following key components:

- **App Package**: Core application package handling routing and main application logic
- **Viewer Package**: Medical image viewer component with:
  - Multiple view modes (slice, volume)
  - Image manipulation tools
  - DICOM image handling
- **Annotator Package**: Extends Viewer with tools and features required for doing tasks
- **API Package**: Frontend API client for backend communication

#### Backend Architecture
The backend follows a clean architecture pattern with:

- **API Layer**: FastAPI endpoints and route handlers
- **Service Layer**: Business logic and data processing
- **Data Layer**: Database models and CRUD operations
- **Core Layer**: Application configuration and shared utilities

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js and Yarn
- Python 3.x

## Development setup

### Setup environment with Docker

To set up the development environment:

1. Clone the repository and set up environment variables:
   ```bash
   cp .env.example .env
   # Modify .env with your configuration
   ```

2. Launch the development containers using VSCode:
   - Run the `[DEV] Launch dev containers` task
   - This will start all required services

3. Initialize the database:
   - Run `[DEV] Migrate database` task to create schema
   - Run `[DEV] Wipe and init database` task to populate initial data

The following services will be available:

| Service | URL | Description |
|---------|-----|-------------|
| Web UI | `https://localhost` | Main application interface |
| API Docs | `https://localhost/api/v1/docs` | Swagger API documentation |
| PACS UI | `https://localhost/pacs/app/explorer.html` | Orthanc DICOM server interface |
| Traefik | `http://localhost:8080/dashboard#/` | Reverse proxy dashboard |

## **Deployment**

There is support for a production setup, but it was not tested. `[PROD] Launch prod containers` will build webapp and serve with nginx and start backend using uvicorn.

## Keyboard Shortcuts
- `Ctrl+Z`: Undo
- `Ctrl+Y` or `Ctrl+Shift+Z`: Redo
- `Alt+=`: Increase tool size
- `Alt+-`: Decrease tool size
- `D`: Draw mode
- `E`: Erase mode
- `Alt+S`: Save
- `→`: Next image
- `←`: Previous image
- `I`: Invert colors
- `B`: Activate brush tool
- `P`: Activate polygon tool
- `S`: Activate spline tool
