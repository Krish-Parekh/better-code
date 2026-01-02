export const twoSumPythonCode = `# Python - Two Sum
class Solution:
    def solve(self, nums, target):
        # TODO: implement
        # return [i, j]
        pass

if __name__ == "__main__":
    import sys
    lines = sys.stdin.read().strip().split('\\n')
    nums = list(map(int, lines[0].strip().split()))
    target = int(lines[1].strip())
    ans = Solution().solve(nums, target)
    print(ans)
`;

export const twoSumJavascriptCode = `// JavaScript - Two Sum
function solve(nums, target) {
    // TODO: implement
    // return [i, j]
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
const nums = input[0].trim().split(' ').map(Number);
const target = parseInt(input[1].trim(), 10);
const ans = solve(nums, target);
console.log(ans);
`;

export const maximumSubarraySumPythonCode = `# Python - Maximum Subarray Sum
class Solution:
    def solve(self, nums):
        # TODO: implement
        # return maximum subarray sum
        pass

if __name__ == "__main__":
    import sys
    nums = list(map(int, sys.stdin.read().strip().split()))
    ans = Solution().solve(nums)
    print(ans)
`;

export const maximumSubarraySumJavascriptCode = `// JavaScript - Maximum Subarray Sum
function solve(nums) {
    // TODO: implement
    // return maximum subarray sum
}

const fs = require('fs');
const nums = fs.readFileSync(0, 'utf-8').trim().split(' ').map(Number);
const ans = solve(nums);
console.log(ans);
`;

export const subarraySumEqualsKPythonCode = `# Python - Subarray Sum Equals K
class Solution:
    def solve(self, nums, k):
        # TODO: implement
        # return count of subarrays whose sum equals k
        pass

if __name__ == "__main__":
    import sys
    lines = sys.stdin.read().strip().split('\\n')
    nums = list(map(int, lines[0].strip().split()))
    k = int(lines[1].strip())
    ans = Solution().solve(nums, k)
    print(ans)
`;

export const subarraySumEqualsKJavascriptCode = `// JavaScript - Subarray Sum Equals K
function solve(nums, k) {
    // TODO: implement
    // return count of subarrays whose sum equals k
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
const nums = input[0].trim().split(' ').map(Number);
const k = parseInt(input[1].trim(), 10);
const ans = solve(nums, k);
console.log(ans);
`;
