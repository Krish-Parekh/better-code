import db from "../index";
import { companies } from "../schema/companies";

const companiesData = [
    {
        name: "Google",
        slug: "google",
        logoUrl: "https://cdn.svglogos.dev/logos/google-icon.svg",
    },
    {
        name: "Microsoft",
        slug: "microsoft",
        logoUrl: "https://cdn.svglogos.dev/logos/microsoft-icon.svg",
    },
    {
        name: "Adobe",
        slug: "adobe",
        logoUrl: "https://cdn.svglogos.dev/logos/adobe-icon.svg",
    },
    {
        name: "American Express",
        slug: "american-express",
        logoUrl: "https://cdn.svglogos.dev/logos/amex-digital.svg",
    },
]

export async function seedCompanies() {
    for (const company of companiesData) {
        await db.insert(companies).values(company).onConflictDoNothing();
    }
}

seedCompanies();