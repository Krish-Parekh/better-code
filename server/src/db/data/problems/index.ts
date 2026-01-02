import { maximumSubarraySumMdx, subarraySumMdx, twoSumMdx } from "../mdx";
import {
	maximumSubarraySumSnippets,
	subarraySumEqualsKSnippets,
	twoSumSnippets,
} from "./snippets";

const data = [
	{
		title: "Two Sum",
		slug: "two-sum",
		bodyMdx: twoSumMdx,
		difficulty: "Easy",
		tags: ["Array", "Hash Table", "Two Pointers"],
		codeSnippets: twoSumSnippets,
		isPaid: false,
	},
	{
		title: "Maximum Subarray Sum",
		slug: "maximum-subarray-sum",
		bodyMdx: maximumSubarraySumMdx,
		difficulty: "Medium",
		tags: ["Array", "Dynamic Programming", "Prefix Sum"],
		codeSnippets: maximumSubarraySumSnippets,
		isPaid: false,
	},
	{
		title: "Subarray Sum Equals K",
		slug: "subarray-sum-equals-k",
		bodyMdx: subarraySumMdx,
		difficulty: "Medium",
		tags: ["Array", "Hash Table", "Prefix Sum"],
		codeSnippets: subarraySumEqualsKSnippets,
		isPaid: false,
	},
];

export default data;
