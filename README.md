![APEX Logo](/assets/color_apex_landscape.png)

# APEX Signature and JOSE Validator

The Apex Signature Validator is an AngularJS application that assists APEX API consumers in verifying whether signatures are generated correctly in their applications when making restful API calls to the APEX API Gateway. See it in action [here](https://govtechsg.github.io/apex-signature-validator/).

You can find out more about Apex signature generation from our reference Node.js implementation at https://github.com/GovTechSG/node-apex-api-security.

# Microservice
This fork includes a microservice that serves the validator frontend and provides a backend to route test requests through. This allows users to make test API calls without having to configure CORS on their Apex gateway.

## Running the container
```bash
$ docker build --tag {container_tag} .
$ docker run --name {container_name} \ 
    -p 3544:3544 \ # Publish application port
    {container_tag}
```

The container will serve the signature validator front-end (e.g. http://localhost:3544, or your own webserver URL) and expose an API that the front-end will use to make HTTP calls.

## Important

- Based on: https://github.com/GovTechSG/apex-signature-validator. A more comprehensive readme is hosted there.

- Apex Signature Validator has been tested on Google Chrome, Firefox and Internet Explorer 11.