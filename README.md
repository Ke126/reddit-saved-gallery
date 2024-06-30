Docker:
docker compose up builds images if necessary and then runs them in containers
docker compose build always attempts to rebuild images by calculating their hashes:
whenever image's sha256 hash changes, the image id with that hash becomes tagged, the old image ids become dangling

if image and build properties are both present in service definition, default behavior is to pull image, else build it and give it the name.