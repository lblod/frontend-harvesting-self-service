/**
 * Creates the correct `authentication-configuration` for `basic` and `oauth2` authentication methods.
 * @param {Object} securitySchemeType
 * @param {Object} securitySchemeConfig
 * @param {Object} credentials
 * @param {Object} store
 * @returns authConfig
 */
export default async function createAuthenticationConfiguration(
  securitySchemeType,
  securitySchemeConfig,
  credentials,
  store
) {
  const getSecuritySchemeModel = (securitySchemeType) => {
    switch (securitySchemeType.label) {
      case 'Basic':
        return 'basic-security-scheme';
      case 'Oauth2':
        return 'oauth2-security-scheme';
      default:
        return 'security-scheme';
    }
  };

  const getCredentialModel = (securitySchemeType) => {
    switch (securitySchemeType.label) {
      case 'Basic':
        return 'basic-authentication-credential';
      case 'Oauth2':
        return 'oauth2-credential';
      default:
        return 'credential';
    }
  };

  let securityScheme = await store.createRecord(
    getSecuritySchemeModel(securitySchemeType),
    securitySchemeType.label === 'Oauth2' ? securitySchemeConfig : ''
  );

  let credential = await store.createRecord(
    getCredentialModel(securitySchemeType),
    credentials
  );

  let authConfig = await store.createRecord('authentication-configuration', {
    securityScheme,
    credential,
  });

  await securityScheme.save();
  await credential.save();
  await authConfig.save();

  return authConfig;
}
