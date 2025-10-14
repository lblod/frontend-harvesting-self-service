# frontend-harvesting-self-service

### Getting started

To include in a semantic.works stack, include the following in docker-compose.yml:

```yml
  frontend:
    image: lblod/frontend-harvesting-self-service:version-tag
    restart: always
```

### Features

### Authentication methods

The harvester supports different methods of authentication. To enable the authentication system set the `EMBER_AUTHENTICATION_ENABLED` variable:

```yml
frontend:
  #...
  environment:
    EMBER_AUTHENTICATION_ENABLED: "true"
```

The default login route can be configured by setting the `EMBER_LOGIN_ROUTE` environment variable to one of the supported values.

#### `login` (default)

This is the default method, so the `EMBER_LOGIN_ROUTE` variable doesn't need to be set.

In order to be able to log in with mu-login, you should include the [mu-login-service](https://github.com/mu-semtech/login-service) in your docker-compose.yml:

```yml
  login:
    image: semtech/mu-login-service:2.9.1
    links:
      - database:database
```

dispatcher.ex should contain the following rule in order to get ember-mu-login working:

```ex
match "/sessions/*path", %{ accept: %{json: true} } do
    Proxy.forward conn, path, "http://login/sessions/"
end
```

### `acmidm-login`

The `acmidm-login` route needs the [acmidm-login-service](https://github.com/lblod/acmidm-login-service). Follow the instructions in the readme.

It also requires some extra environment variables in the frontend:

> The code snippet contains example values, adjust these based on your environment

```yml
frontend:
  #...
  environment:
    EMBER_LOGIN_ROUTE: "acmidm-login"
    EMBER_ACMIDM_CLIENT_ID: "client-id"
    EMBER_ACMIDM_BASE_URL: "https://authenticatie.vlaanderen.be/op/v1/auth"
    EMBER_ACMIDM_REDIRECT_URL: "https://your-domain/authorization/callback"
    EMBER_ACMIDM_LOGOUT_URL: "https://authenticatie.vlaanderen.be/op/v1/logout"
    EMBER_ACMIDM_SCOPE: "openid rrn vo profile"
```
