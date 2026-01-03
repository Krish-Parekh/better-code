export const testCasesData = {
    "two-sum": [
        {
            stdin: "2 7 11 15\n9",
            stdout: "[0, 1]",
            input: "nums = [2, 7, 11, 15]\ntarget = 9",
            output: "[0, 1]",
            bodyMdx:
                "**Input:** `nums = [2, 7, 11, 15]`, `target = 9`\n\n**Output:** `[0, 1]`\n\n**Explanation:** Because `nums[0] + nums[1] = 2 + 7 = 9`, we return `[0, 1]`.",
        },
        {
            stdin: "3 2 4\n6",
            stdout: "[1, 2]",
            input: "nums = [3, 2, 4]\ntarget = 6",
            output: "[1, 2]",
            bodyMdx:
                "**Input:** `nums = [3, 2, 4]`, `target = 6`\n\n**Output:** `[1, 2]`\n\n**Explanation:** Because `nums[1] + nums[2] = 2 + 4 = 6`, we return `[1, 2]`.",
        },
        {
            stdin: "3 3\n6",
            stdout: "[0, 1]",
            input: "nums = [3, 3]\ntarget = 6",
            output: "[0, 1]",
            bodyMdx:
                "**Input:** `nums = [3, 3]`, `target = 6`\n\n**Output:** `[0, 1]`\n\n**Explanation:** Because `nums[0] + nums[1] = 3 + 3 = 6`, we return `[0, 1]`.",
        },
        {
            stdin: "-1 -2 -3 -4 -5\n-8",
            stdout: "[2, 4]",
            input: "nums = [-1, -2, -3, -4, -5]\ntarget = -8",
            output: "[2, 4]",
            bodyMdx:
                "**Input:** `nums = [-1, -2, -3, -4, -5]`, `target = -8`\n\n**Output:** `[2, 4]`\n\n**Explanation:** Because `nums[2] + nums[4] = -3 + -5 = -8`, we return `[2, 4]`.",
        },
    ],

    "maximum-subarray-sum": [
        {
            stdin: "-2 1 -3 4 -1 2 1 -5 4",
            stdout: "6",
            input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
            output: "6",
            bodyMdx:
                "**Input:** `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`\n\n**Output:** `6`\n\n**Explanation:** The subarray `[4, -1, 2, 1]` has the largest sum = `6`.",
        },
        {
            stdin: "1",
            stdout: "1",
            input: "nums = [1]",
            output: "1",
            bodyMdx:
                "**Input:** `nums = [1]`\n\n**Output:** `1`\n\n**Explanation:** The subarray `[1]` has the largest sum = `1`.",
        },
        {
            stdin: "5 4 -1 7 8",
            stdout: "23",
            input: "nums = [5, 4, -1, 7, 8]",
            output: "23",
            bodyMdx:
                "**Input:** `nums = [5, 4, -1, 7, 8]`\n\n**Output:** `23`\n\n**Explanation:** The subarray `[5, 4, -1, 7, 8]` has the largest sum = `23`.",
        },
        {
            stdin: "-1",
            stdout: "-1",
            input: "nums = [-1]",
            output: "-1",
            bodyMdx:
                "**Input:** `nums = [-1]`\n\n**Output:** `-1`\n\n**Explanation:** The subarray `[-1]` has the largest sum = `-1`.",
        },
        {
            stdin: "-2 -1",
            stdout: "-1",
            input: "nums = [-2, -1]",
            output: "-1",
            bodyMdx:
                "**Input:** `nums = [-2, -1]`\n\n**Output:** `-1`\n\n**Explanation:** The subarray `[-1]` has the largest sum = `-1`.",
        },
    ],
    "subarray-sum-equals-k": [
        {
            stdin: "1 1 1\n2",
            stdout: "2",
            input: "nums = [1, 1, 1]\nk = 2",
            output: "2",
            bodyMdx:
                "**Input:** `nums = [1, 1, 1]`, `k = 2`\n\n**Output:** `2`\n\n**Explanation:** The subarrays `[1, 1]` (indices 0-1) and `[1, 1]` (indices 1-2) both sum to `2`.",
        },
        {
            stdin: "1 2 3\n3",
            stdout: "2",
            input: "nums = [1, 2, 3]\nk = 3",
            output: "2",
            bodyMdx:
                "**Input:** `nums = [1, 2, 3]`, `k = 3`\n\n**Output:** `2`\n\n**Explanation:** The subarrays `[1, 2]` (indices 0-1) and `[3]` (index 2) both sum to `3`.",
        },
        {
            stdin: "1 -1 0\n0",
            stdout: "3",
            input: "nums = [1, -1, 0]\nk = 0",
            output: "3",
            bodyMdx:
                "**Input:** `nums = [1, -1, 0]`, `k = 0`\n\n**Output:** `3`\n\n**Explanation:** The subarrays `[1, -1]`, `[-1, 0]`, and `[0]` all sum to `0`.",
        },
        {
            stdin: "1\n0",
            stdout: "0",
            input: "nums = [1]\nk = 0",
            output: "0",
            bodyMdx:
                "**Input:** `nums = [1]`, `k = 0`\n\n**Output:** `0`\n\n**Explanation:** No subarray sums to `0`.",
        },
    ]
}