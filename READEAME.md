# DevNet Expert Documentation Archive

This Flask application serves archived versions of documentation that will be available during the Cisco Certified DevNet Expert exam. The documentation is archived and is the version that will be available to you during the exam. In order to best prepare for the exam, I recommend that you only work with the Candidate Workstation [CWS](https://learningnetwork.cisco.com/s/article/devnet-expert-equipment-and-software-list). This is the same environment you will have during the exam and all dependencies are already in the correct version.

And if you are looking for resources to help you prepare for the DevNet Expert exam, check out my e-learning [DevNet Academy](https://devnet-academy.com).

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Python](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)

## Getting Started
Please follow these instructions to build and run the application locally.

```bash
# Clone the project
git clone https://github.com/lucagubler/devnet-expert-docs-archive.git
cd devnet-expert-docs-archive

# Build the container
docker built -t devnet-expert-docs .

# Run the container
docker run -d -p 5000:5000 --name devnet-expert-docs-container devnet-expert-docs

# Now you can access http://localhost:5000 in your browser
```

## Stopping and Removing the Container
Please follow these instructions to stop and delete the container

```bash
docker container stop devnet-expert-docs-container
docker rm devnet-expert-docs-container
```

## Additional Notes
The executing above command to run the container, we map the local port 5000 to remote port 5000 (e.g. `-p <local-port>:<remote-port>` &rarr; `-p 5000:5000`). If you already use port 5000 locally, simply replace the local port with a different port (e.g. `-p 8080:5000`). Keep in mind that you also have to change the port when accessing the website in your browser.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.
