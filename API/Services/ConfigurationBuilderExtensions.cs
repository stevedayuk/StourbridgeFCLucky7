using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;
using Azure.Identity;

namespace StourbridgeFc.Lucky7.Api.Services;

public static class ConfigurationBuilderExtensions
{
    public static IConfigurationBuilder AddAzureKeyVault(this IConfigurationBuilder configuration,
        string keyVaultName, string azureAdApplicationId, string azureAdCertThumbprint, string azureAdDirectoryId)
    {
        X509Certificate2 x509Certificate;

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            // Load certificate from local store
            using var x509Store = new X509Store(StoreLocation.CurrentUser);

            x509Store.Open(OpenFlags.ReadOnly);

            x509Certificate = x509Store.Certificates
                .Find(
                    X509FindType.FindByThumbprint,
                    azureAdCertThumbprint,
                    validOnly: false)
                .OfType<X509Certificate2>()
                .Single();
        }
        else
        {
            // Load certificate from PEM files.
            x509Certificate = X509Certificate2.CreateFromPemFile("/cert/az-public.pem", "/cert/az-private.pem");
        }

        // Add Azure Key Vault
        configuration.AddAzureKeyVault(
            new Uri($"https://{keyVaultName}.vault.azure.net/"),
            new ClientCertificateCredential(
                azureAdDirectoryId,
                azureAdApplicationId,
                x509Certificate));

        return configuration;
    }
}