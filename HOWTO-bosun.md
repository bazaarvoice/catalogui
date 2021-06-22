# `bosun-repo-init` usage guide

This mini-HOWTO will give you some idea about what to do with your repo after running the `bosun-repo-init` tool against it.


### Build a Local container:
To build a docker container:
```
make container
```

### Run Locally:

##### To start the app:
```
make docker-run
```
##### To view the app:

Open [http://localhost:8080](http://localhost:8080) in the browser of your choice


##### To stop the app:
```
make docker-stop
```

### Releasing a new version:

"Releasing" a new version of the container in this context really means "Create a `git` tag, push the tag, and let the `bosun` cluster build an image for me automatically." To facilitate, `make` targets are included to help.  Following [semantic versioning](https://semver.org/) pattern `MAJOR.MINOR.MICRO`, the targets are:
```
make release-major
make release-minor
make release-micro
```
The above targets will increment the designated version component, add a new tag of the form `vX.Y.Z` (e.g. `v1.2.3`), and push the tag to GitHub.  The tag will then fire the webhook `POST` configured in the GitHub web interface to [Tekton](https://cloud.google.com/tekton) running on the QA Bosun cluster.  The Tekton listener will:
1. Create(and tag) an ECR repo with the same name as the GitHub repo if one does not already exist
2. Create a new Docker image reading the `Dockerfile` supplied in the root directory of the repository
3. Push the image to the corresponding ECR repo tagged with the version calculated by the `make` target.

### `helm` deploys:
After updating the appropriate value file(s) (e.g. `values.yaml`, `values-qa.yaml`) to use the freshly minted ECR image, the targets below will deploy your app to the designated `bosun` cluster.  The specific value to update is `Values.bosun-simple-app.container.tag`.
```
make deploy-qa
make deploy-prod
```
