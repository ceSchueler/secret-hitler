
docker run -it --rm --name sh_container --publish=6379:6379^
  -v "%cd%/data:/opt/secret-hitler/data:rw" ^
  -v "%cd%/logs:/opt/secret-hitler/logs:rw" ^
  -v "%cd%:/opt/secret-hitler:rw" ^
  -p 8080:8080 ^
  sh:local