export const problemsCompaniesData: Record<
	string,
	{ companySlug: string; frequency: number; lastSeenYear: number }[]
> = {
	"two-sum": [
		{ companySlug: "google", frequency: 5, lastSeenYear: 2024 },
		{ companySlug: "meta", frequency: 4, lastSeenYear: 2024 },
		{ companySlug: "adobe", frequency: 3, lastSeenYear: 2023 },
		{ companySlug: "american-express", frequency: 2, lastSeenYear: 2023 },
		{ companySlug: "atlassian", frequency: 2, lastSeenYear: 2024 },
		{ companySlug: "linkedin", frequency: 3, lastSeenYear: 2024 },
	],
	"maximum-subarray-sum": [
		{ companySlug: "atlassian", frequency: 5, lastSeenYear: 2024 },
		{ companySlug: "google", frequency: 4, lastSeenYear: 2024 },
		{ companySlug: "american-express", frequency: 3, lastSeenYear: 2023 },
	],
	"subarray-sum-equals-k": [
		{ companySlug: "meta", frequency: 5, lastSeenYear: 2024 },
		{ companySlug: "adobe", frequency: 4, lastSeenYear: 2024 },
		{ companySlug: "linkedin", frequency: 3, lastSeenYear: 2023 },
	],
};
