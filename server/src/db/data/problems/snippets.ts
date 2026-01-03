export const twoSumSnippets = {
	python: {
		template: `class Solution:
    def solve(self, nums, target):
        # TODO: implement
        # return [i, j]
        pass`,
		prefix: `# Python - Two Sum
import sys`,
		suffix: `
if __name__ == "__main__":
    lines = sys.stdin.read().strip().split('\\n')
    nums = list(map(int, lines[0].strip().split()))
    target = int(lines[1].strip())
    ans = Solution().solve(nums, target)
    print(ans)`,
	},
	javascript: {
		template: `function solve(nums, target) {
    // TODO: implement
    // return [i, j]
}`,
		prefix: `// JavaScript - Two Sum
const fs = require('fs');`,
		suffix: `
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
const nums = input[0].trim().split(' ').map(Number);
const target = parseInt(input[1].trim(), 10);
const ans = solve(nums, target);
console.log(ans);`,
	},
	cpp: {
		template: `class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // TODO: implement
        // return [i, j]
    }
};`,
		prefix: `// C++ - Two Sum
#include <vector>
#include <iostream>
using namespace std;`,
		suffix: `
int main() {
    vector<int> nums;
    int target;
    int num;
    while (cin >> num) {
        nums.push_back(num);
        if (cin.peek() == '\\n') break;
    }
    cin >> target;
    Solution sol;
    vector<int> ans = sol.solve(nums, target);
    for (int i = 0; i < ans.size(); i++) {
        cout << ans[i];
        if (i < ans.size() - 1) cout << " ";
    }
    return 0;
}`,
	},
};

export const maximumSubarraySumSnippets = {
	python: {
		template: `class Solution:
    def solve(self, nums):
        # TODO: implement
        # return maximum subarray sum
        pass`,
		prefix: `# Python - Maximum Subarray Sum
import sys`,
		suffix: `
if __name__ == "__main__":
    nums = list(map(int, sys.stdin.read().strip().split()))
    ans = Solution().solve(nums)
    print(ans)`,
	},
	javascript: {
		template: `function solve(nums) {
    // TODO: implement
    // return maximum subarray sum
}`,
		prefix: `// JavaScript - Maximum Subarray Sum
const fs = require('fs');`,
		suffix: `
const nums = fs.readFileSync(0, 'utf-8').trim().split(' ').map(Number);
const ans = solve(nums);
console.log(ans);`,
	},
	cpp: {
		template: `class Solution {
public:
    int solve(vector<int>& nums) {
        // TODO: implement
        // return maximum subarray sum
    }
};`,
		prefix: `// C++ - Maximum Subarray Sum
#include <vector>
#include <iostream>
using namespace std;`,
		suffix: `
int main() {
    vector<int> nums;
    int num;
    while (cin >> num) {
        nums.push_back(num);
        if (cin.peek() == '\\n') break;
    }
    Solution sol;
    int ans = sol.solve(nums);
    cout << ans << endl;
    return 0;
}`,
	},
};

export const subarraySumEqualsKSnippets = {
	python: {
		template: `class Solution:
    def solve(self, nums, k):
        # TODO: implement
        # return count of subarrays whose sum equals k
        pass`,
		prefix: `# Python - Subarray Sum Equals K
import sys`,
		suffix: `
if __name__ == "__main__":
    lines = sys.stdin.read().strip().split('\\n')
    nums = list(map(int, lines[0].strip().split()))
    k = int(lines[1].strip())
    ans = Solution().solve(nums, k)
    print(ans)`,
	},
	javascript: {
		template: `function solve(nums, k) {
    // TODO: implement
    // return count of subarrays whose sum equals k
}`,
		prefix: `// JavaScript - Subarray Sum Equals K
const fs = require('fs');`,
		suffix: `
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
const nums = input[0].trim().split(' ').map(Number);
const k = parseInt(input[1].trim(), 10);
const ans = solve(nums, k);
console.log(ans);`,
	},
	cpp: {
		template: `class Solution {
public:
    int solve(vector<int>& nums, int k) {
        // TODO: implement
        // return count of subarrays whose sum equals k
    }
};`,
		prefix: `// C++ - Subarray Sum Equals K
#include <vector>
#include <iostream>
using namespace std;`,
		suffix: `
int main() {
    vector<int> nums;
    int k;
    int num;
    while (cin >> num) {
        nums.push_back(num);
        if (cin.peek() == '\\n') break;
    }
    cin >> k;
    Solution sol;
    int ans = sol.solve(nums, k);
    cout << ans << endl;
    return 0;
}`,
	},
};

export const snippets = {
	twoSum: twoSumSnippets,
	maximumSubarraySum: maximumSubarraySumSnippets,
	subarraySumEqualsK: subarraySumEqualsKSnippets,
};
