interface Templates {
	python: string;
	javascript: string;
}

export const subarraySumTemplates: Templates = {
	python: `# Python - Subarray Sum Equals K
  class Solution:
      def solve(self, nums, k):
          # TODO: implement
          # return count of subarrays with sum == k
          pass
  
  if __name__ == "__main__":
      import sys
      data = sys.stdin.read().strip().split()
      it = iter(data)
      n = int(next(it))
      nums = [int(next(it)) for _ in range(n)]
      k = int(next(it))
      ans = Solution().solve(nums, k)
      print(ans)
  `,
	javascript: `// JavaScript (Node) - Subarray Sum Equals K
  class Solution {
    solve(nums, k) {
      // TODO: implement
      // return count of subarrays with sum == k
      return 0;
    }
  }
  
  (function () {
    const fs = require("fs");
    const lines = fs.readFileSync(0, "utf8").trim().split("\\n");
    const n = Number(lines[0]);
    const nums = lines[1].trim().split(" ").map(Number);
    const k = Number(lines[2]);
    const res = new Solution().solve(nums, k);
    console.log(res);
  })();
  `,
};

export const subarraySumMdx: string = `
  # Subarray Sum Equals K
  
  Given an array of integers \`nums\` and an integer \`k\`, return the **total number of continuous subarrays** whose sum equals to \`k\`.
  
  ---
  
  ## Input Format
  - \`nums\`: an array of integers  
  - \`k\`: an integer representing the target sum
  
  ### Example Input
  \`\`\`
  nums = [1, 1, 1]
  k = 2
  \`\`\`
  
  ---
  
  ## Output Format
  - Return a single integer representing the **count of subarrays** whose elements sum up to \`k\`.
  
  ### Example Output
  \`\`\`
  2
  \`\`\`
  
  ### Explanation
  Subarrays \`[1, 1]\` (first two elements) and \`[1, 1]\` (last two elements) both sum to \`2\`.
  
  ---
  
  ## Constraints
  - \`1 <= nums.length <= 2 * 10^4\`  
  - \`-1000 <= nums[i] <= 1000\`  
  - \`-10^7 <= k <= 10^7\`
  
  ---
  
  ## Follow-Ups
  - Can you solve it in **O(n)** time using a prefix-sum and hash map approach?  
  - How would you modify the solution if you needed to find **all subarrays** instead of just the count?
  
  ---
  
  ## Complexity
  | Approach | Time | Space |
  |-----------|------|--------|
  | Brute Force | O(n²) | O(1) |
  | Prefix Sum + Hash Map (Optimal) | O(n) | O(n) |
  `;
