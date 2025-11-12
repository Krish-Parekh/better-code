interface Templates {
    python: string;
    javascript: string;
    java: string;
  }
  
  export const maximumSubarrayTemplates: Templates = {
    python: `# Python - Maximum Subarray (Kadane)
  class Solution:
      def solve(self, nums):
          # TODO: implement Kadane's algorithm
          # return max subarray sum (int)
          pass
  
  if __name__ == "__main__":
      import sys
      data = sys.stdin.read().strip().split()
      it = iter(data)
      n = int(next(it))
      nums = [int(next(it)) for _ in range(n)]
      ans = Solution().solve(nums)
      print(ans)
  `,
    javascript: `// JavaScript (Node) - Maximum Subarray (Kadane)
  class Solution {
    solve(nums) {
      // TODO: implement Kadane's algorithm
      // return max subarray sum (number)
      return 0;
    }
  }
  
  (function () {
    const fs = require("fs");
    const lines = fs.readFileSync(0, "utf8").trim().split("\\n");
    const n = Number(lines[0]);
    const nums = lines[1].trim().split(" ").map(Number);
    const res = new Solution().solve(nums);
    console.log(res);
  })();
  `,
    java: `// Java - Maximum Subarray (Kadane)
  import java.util.*;
  public class Solution {
      public long solve(int[] nums) {
          // TODO: implement Kadane's algorithm
          // return max subarray sum (long/int)
          return 0L;
      }
      public static void main(String[] args){
          Scanner sc = new Scanner(System.in);
          int n = Integer.parseInt(sc.nextLine().trim());
          int[] nums = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();
          long ans = new Solution().solve(nums);
          System.out.println(ans);
          sc.close();
      }
  }
  `,
  };
  
  export const maximumSubarrayMdx: string = `
  # Maximum Subarray (Kadane’s Algorithm)
  
  Given an integer array \`nums\`, find the **contiguous subarray** (containing at least one number) which has the **largest sum**, and return its sum.
  
  ---
  
  ## Input Format
  - \`nums\`: an array of integers
  
  ### Example Input
  \`\`\`
  nums = [-2,1,-3,4,-1,2,1,-5,4]
  \`\`\`
  
  ---
  
  ## Output Format
  - A single integer representing the **maximum subarray sum**.
  
  ### Example Output
  \`\`\`
  6
  \`\`\`
  
  ### Explanation
  The subarray \`[4,-1,2,1]\` has the largest sum = \`6\`.
  
  ---
  
  ## Constraints
  - \`1 <= nums.length <= 10^5\`  
  - \`-10^4 <= nums[i] <= 10^4\`
  
  ---
  
  ## Follow-Ups
  - Can you solve it in **O(n)** time using Kadane’s algorithm?  
  - How would you return the **actual subarray** (start & end indices)?  
  - Can you adapt it for **maximum product subarray** or **2D maximum submatrix**?
  
  ---
  
  ## Complexity
  | Approach | Time | Space |
  |-----------|------|--------|
  | Brute Force | O(n²) | O(1) |
  | Kadane’s (Optimal) | O(n) | O(1) |
  `;
  