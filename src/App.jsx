import { useState, useMemo, useEffect } from "react";
import { useAuth } from './contexts/AuthContext';
import { useProgress } from './hooks/useProgress';
import Login from './components/Login';

const problems = [
  {id:1,name:"Merge Sorted Array",topic:"Arrays/String",difficulty:"Easy",pattern:"Two Pointers",approach:"Use two pointers from the end of both arrays and fill m+n-1 index backwards.",link:"https://leetcode.com/problems/merge-sorted-array/",solution:`// Two Pointers from end — O(m+n) time, O(1) space
public void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m-1, j = n-1, k = m+n-1;
    while (i >= 0 && j >= 0)
        nums1[k--] = nums1[i] > nums2[j] ? nums1[i--] : nums2[j--];
    while (j >= 0) nums1[k--] = nums2[j--];
}`},
  {id:2,name:"Remove Element",topic:"Arrays/String",difficulty:"Easy",pattern:"Two Pointers",approach:"Use a slow pointer to overwrite elements equal to val.",link:"https://leetcode.com/problems/remove-element/",solution:`public int removeElement(int[] nums, int val) {
    int k = 0;
    for (int n : nums) if (n != val) nums[k++] = n;
    return k;
}`},
  {id:3,name:"Remove Duplicates from Sorted Array",topic:"Arrays/String",difficulty:"Easy",pattern:"Two Pointers",approach:"Slow pointer tracks unique position; fast pointer scans ahead.",link:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/",solution:`public int removeDuplicates(int[] nums) {
    int k = 1;
    for (int i = 1; i < nums.length; i++)
        if (nums[i] != nums[i-1]) nums[k++] = nums[i];
    return k;
}`},
  {id:4,name:"Remove Duplicates from Sorted Array II",topic:"Arrays/String",difficulty:"Medium",pattern:"Two Pointers",approach:"Allow at most 2 duplicates by comparing current with nums[k-2].",link:"https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",solution:`public int removeDuplicates(int[] nums) {
    int k = 0;
    for (int n : nums)
        if (k < 2 || nums[k-2] != n) nums[k++] = n;
    return k;
}`},
  {id:5,name:"Majority Element",topic:"Arrays/String",difficulty:"Easy",pattern:"Boyer-Moore Voting",approach:"Candidate + count; majority element always survives cancellation.",link:"https://leetcode.com/problems/majority-element/",solution:`public int majorityElement(int[] nums) {
    int cand = nums[0], cnt = 1;
    for (int i = 1; i < nums.length; i++) {
        if (cnt == 0) { cand = nums[i]; cnt = 1; }
        else cnt += (nums[i] == cand) ? 1 : -1;
    }
    return cand;
}`},
  {id:6,name:"Rotate Array",topic:"Arrays/String",difficulty:"Medium",pattern:"Reverse",approach:"Reverse full array, then reverse [0,k-1] and [k,n-1].",link:"https://leetcode.com/problems/rotate-array/",solution:`public void rotate(int[] nums, int k) {
    int n = nums.length; k %= n;
    reverse(nums, 0, n-1);
    reverse(nums, 0, k-1);
    reverse(nums, k, n-1);
}
private void reverse(int[] a, int l, int r) {
    while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
}`},
  {id:7,name:"Best Time to Buy and Sell Stock",topic:"Arrays/String",difficulty:"Easy",pattern:"Greedy / Sliding Window",approach:"Track min price seen so far; update max profit at each step.",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",solution:`public int maxProfit(int[] prices) {
    int minP = Integer.MAX_VALUE, maxP = 0;
    for (int p : prices) {
        minP = Math.min(minP, p);
        maxP = Math.max(maxP, p - minP);
    }
    return maxP;
}`},
  {id:8,name:"Best Time to Buy and Sell Stock II",topic:"Arrays/String",difficulty:"Medium",pattern:"Greedy",approach:"Add every positive difference (valley to peak) — unlimited transactions.",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",solution:`public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++)
        if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];
    return profit;
}`},
  {id:9,name:"Jump Game",topic:"Arrays/String",difficulty:"Medium",pattern:"Greedy",approach:"Track the farthest index reachable; if current index exceeds it, return false.",link:"https://leetcode.com/problems/jump-game/",solution:`public boolean canJump(int[] nums) {
    int reach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > reach) return false;
        reach = Math.max(reach, i + nums[i]);
    }
    return true;
}`},
  {id:10,name:"Jump Game II",topic:"Arrays/String",difficulty:"Medium",pattern:"Greedy / BFS Levels",approach:"Track current jump's farthest reach; when you cross it, increment jumps.",link:"https://leetcode.com/problems/jump-game-ii/",solution:`public int jump(int[] nums) {
    int jumps=0, curEnd=0, farthest=0;
    for (int i = 0; i < nums.length-1; i++) {
        farthest = Math.max(farthest, i+nums[i]);
        if (i == curEnd) { jumps++; curEnd = farthest; }
    }
    return jumps;
}`},
  {id:11,name:"H-Index",topic:"Arrays/String",difficulty:"Medium",pattern:"Sorting / Counting Sort",approach:"Sort descending; find largest h where citations[h-1] >= h.",link:"https://leetcode.com/problems/h-index/",solution:`public int hIndex(int[] citations) {
    Arrays.sort(citations);
    int n = citations.length, h = 0;
    for (int i = n-1; i >= 0; i--)
        if (citations[i] >= n-i) h = n-i; else break;
    return h;
}`},
  {id:12,name:"Insert Delete GetRandom O(1)",topic:"Arrays/String",difficulty:"Medium",pattern:"HashMap + ArrayList",approach:"Map stores val→index; swap with last on delete to maintain O(1).",link:"https://leetcode.com/problems/insert-delete-getrandom-o1/",solution:`class RandomizedSet {
    Map<Integer,Integer> map = new HashMap<>();
    List<Integer> list = new ArrayList<>();
    Random rand = new Random();
    public boolean insert(int val) {
        if(map.containsKey(val)) return false;
        list.add(val); map.put(val, list.size()-1); return true;
    }
    public boolean remove(int val) {
        if(!map.containsKey(val)) return false;
        int idx = map.get(val), last = list.get(list.size()-1);
        list.set(idx, last); map.put(last, idx);
        list.remove(list.size()-1); map.remove(val); return true;
    }
    public int getRandom() { return list.get(rand.nextInt(list.size())); }
}`},
  {id:13,name:"Product of Array Except Self",topic:"Arrays/String",difficulty:"Medium",pattern:"Prefix & Suffix Product",approach:"Left pass computes prefix products; right pass multiplies suffix in-place.",link:"https://leetcode.com/problems/product-of-array-except-self/",solution:`public int[] productExceptSelf(int[] nums) {
    int n = nums.length; int[] res = new int[n];
    res[0] = 1;
    for (int i = 1; i < n; i++) res[i] = res[i-1]*nums[i-1];
    int right = 1;
    for (int i = n-1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
    return res;
}`},
  {id:14,name:"Gas Station",topic:"Arrays/String",difficulty:"Medium",pattern:"Greedy",approach:"If total gas >= total cost a solution exists; start where cumulative tank never goes negative.",link:"https://leetcode.com/problems/gas-station/",solution:`public int canCompleteCircuit(int[] gas, int[] cost) {
    int total=0, tank=0, start=0;
    for (int i=0; i<gas.length; i++) {
        int diff = gas[i]-cost[i];
        tank += diff; total += diff;
        if (tank < 0) { start = i+1; tank = 0; }
    }
    return total >= 0 ? start : -1;
}`},
  {id:15,name:"Candy",topic:"Arrays/String",difficulty:"Hard",pattern:"Greedy (Two Pass)",approach:"Left→right pass ensures right neighbor gets more; right→left pass ensures left neighbor gets more.",link:"https://leetcode.com/problems/candy/",solution:`public int candy(int[] ratings) {
    int n = ratings.length; int[] c = new int[n];
    Arrays.fill(c, 1);
    for (int i=1;i<n;i++) if(ratings[i]>ratings[i-1]) c[i]=c[i-1]+1;
    for (int i=n-2;i>=0;i--) if(ratings[i]>ratings[i+1]) c[i]=Math.max(c[i],c[i+1]+1);
    return Arrays.stream(c).sum();
}`},
  {id:16,name:"Trapping Rain Water",topic:"Arrays/String",difficulty:"Hard",pattern:"Two Pointers",approach:"Use left/right pointers; water trapped at each position = min(maxL,maxR) - height.",link:"https://leetcode.com/problems/trapping-rain-water/",solution:`public int trap(int[] h) {
    int l=0,r=h.length-1,maxL=0,maxR=0,res=0;
    while(l<r){
        if(h[l]<h[r]){
            if(h[l]>=maxL) maxL=h[l]; else res+=maxL-h[l]; l++;
        } else {
            if(h[r]>=maxR) maxR=h[r]; else res+=maxR-h[r]; r--;
        }
    }
    return res;
}`},
  {id:17,name:"Roman to Integer",topic:"Arrays/String",difficulty:"Easy",pattern:"HashMap / Simulation",approach:"If current value < next value, subtract; else add.",link:"https://leetcode.com/problems/roman-to-integer/",solution:`public int romanToInt(String s) {
    Map<Character,Integer> m = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);
    int res=0;
    for(int i=0;i<s.length();i++){
        int v=m.get(s.charAt(i));
        if(i+1<s.length()&&v<m.get(s.charAt(i+1))) res-=v; else res+=v;
    }
    return res;
}`},
  {id:18,name:"Integer to Roman",topic:"Arrays/String",difficulty:"Medium",pattern:"Greedy",approach:"Use value-symbol pairs in descending order; keep subtracting largest fitting value.",link:"https://leetcode.com/problems/integer-to-roman/",solution:`public String intToRoman(int num) {
    int[] v={1000,900,500,400,100,90,50,40,10,9,5,4,1};
    String[] s={"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
    StringBuilder sb=new StringBuilder();
    for(int i=0;i<v.length;i++) while(num>=v[i]){sb.append(s[i]);num-=v[i];}
    return sb.toString();
}`},
  {id:19,name:"Length of Last Word",topic:"Arrays/String",difficulty:"Easy",pattern:"String Traversal",approach:"Trim trailing spaces, then count backwards until space.",link:"https://leetcode.com/problems/length-of-last-word/",solution:`public int lengthOfLastWord(String s) {
    s = s.trim(); int len=0;
    for(int i=s.length()-1;i>=0&&s.charAt(i)!=' ';i--) len++;
    return len;
}`},
  {id:20,name:"Longest Common Prefix",topic:"Arrays/String",difficulty:"Easy",pattern:"Horizontal Scanning",approach:"Compare characters column by column across all strings.",link:"https://leetcode.com/problems/longest-common-prefix/",solution:`public String longestCommonPrefix(String[] strs) {
    String pre = strs[0];
    for(String s:strs) while(!s.startsWith(pre)) pre=pre.substring(0,pre.length()-1);
    return pre;
}`},
  {id:21,name:"Reverse Words in a String",topic:"Arrays/String",difficulty:"Medium",pattern:"String Split / Two Pointers",approach:"Split by spaces, filter blanks, reverse array, join.",link:"https://leetcode.com/problems/reverse-words-in-a-string/",solution:`public String reverseWords(String s) {
    String[] w = s.trim().split("\\s+");
    StringBuilder sb = new StringBuilder();
    for(int i=w.length-1;i>=0;i--){ sb.append(w[i]); if(i>0) sb.append(' ');}
    return sb.toString();
}`},
  {id:22,name:"Zigzag Conversion",topic:"Arrays/String",difficulty:"Medium",pattern:"Simulation / Row Assignment",approach:"Assign chars to rows; toggle direction when hitting top/bottom row.",link:"https://leetcode.com/problems/zigzag-conversion/",solution:`public String convert(String s, int numRows) {
    if(numRows==1) return s;
    StringBuilder[] rows = new StringBuilder[numRows];
    for(int i=0;i<numRows;i++) rows[i]=new StringBuilder();
    int row=0; boolean down=false;
    for(char c:s.toCharArray()){
        rows[row].append(c);
        if(row==0||row==numRows-1) down=!down;
        row+=down?1:-1;
    }
    StringBuilder res=new StringBuilder();
    for(StringBuilder r:rows) res.append(r);
    return res.toString();
}`},
  {id:23,name:"Find the Index of the First Occurrence in a String",topic:"Arrays/String",difficulty:"Easy",pattern:"KMP / Built-in",approach:"Use KMP failure function for O(n+m) matching.",link:"https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",solution:`public int strStr(String haystack, String needle) {
    return haystack.indexOf(needle); // or KMP for O(n+m)
}`},
  {id:24,name:"Text Justification",topic:"Arrays/String",difficulty:"Hard",pattern:"Greedy / Simulation",approach:"Greedily pack words per line; distribute spaces evenly, last line left-aligned.",link:"https://leetcode.com/problems/text-justification/",solution:`public List<String> fullJustify(String[] words, int maxWidth) {
    List<String> res=new ArrayList<>(); int i=0,n=words.length;
    while(i<n){
        int len=words[i].length(),j=i+1;
        while(j<n&&len+1+words[j].length()<=maxWidth) len+=1+words[j++].length();
        StringBuilder sb=new StringBuilder(words[i]);
        int spaces=maxWidth-len,gaps=j-i-1;
        if(j==n||gaps==0){
            for(int k=i+1;k<j;k++) sb.append(' ').append(words[k]);
            while(sb.length()<maxWidth) sb.append(' ');
        } else {
            int sp=spaces/gaps,extra=spaces%gaps;
            for(int k=i+1;k<j;k++){
                for(int s=0;s<=sp+(k-i-1<extra?1:0);s++) sb.append(' ');
                sb.append(words[k]);
            }
        }
        res.add(sb.toString()); i=j;
    }
    return res;
}`},
  {id:25,name:"Rotate Matrix",topic:"Arrays/String",difficulty:"Medium",pattern:"Matrix Manipulation",approach:"Transpose matrix then reverse each row (in-place 90° clockwise rotation).",link:"https://leetcode.com/problems/rotate-image/",solution:`public void rotate(int[][] m) {
    int n=m.length;
    for(int i=0;i<n;i++) for(int j=i;j<n;j++){int t=m[i][j];m[i][j]=m[j][i];m[j][i]=t;}
    for(int[] row:m){int l=0,r=n-1;while(l<r){int t=row[l];row[l++]=row[r];row[r--]=t;}}
}`},
  {id:26,name:"Merge Overlapping Subintervals",topic:"Arrays/String",difficulty:"Medium",pattern:"Sorting + Greedy",approach:"Sort by start; merge if current start <= previous end.",link:"https://leetcode.com/problems/merge-intervals/",solution:`public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals,(a,b)->a[0]-b[0]);
    List<int[]> res=new ArrayList<>();
    for(int[] iv:intervals){
        if(!res.isEmpty()&&iv[0]<=res.get(res.size()-1)[1])
            res.get(res.size()-1)[1]=Math.max(res.get(res.size()-1)[1],iv[1]);
        else res.add(iv);
    }
    return res.toArray(new int[0][]);
}`},
  {id:27,name:"Merge two sorted arrays without extra space",topic:"Arrays/String",difficulty:"Medium",pattern:"Gap Algorithm / Shell Sort",approach:"Use Shell sort gap method: compare elements gap apart and swap if needed.",link:"https://leetcode.com/problems/merge-sorted-array/",solution:`// Gap method — O(n log n) time, O(1) space
public void mergeWithoutExtra(long[] a, long[] b, int n, int m) {
    int gap=(int)Math.ceil((double)(n+m)/2);
    while(gap>0){
        int i=0,j=gap;
        while(j<n+m){
            long[] arr=(i<n&&j<n)?new long[]{a[i],a[j]}:
                       (i<n&&j>=n)?new long[]{a[i],b[j-n]}:
                       new long[]{b[i-n],b[j-n]};
            if(arr[0]>arr[1]){/* swap appropriately */}
            i++;j++;
        }
        gap=gap==1?0:(int)Math.ceil((double)gap/2);
    }
}`},
  {id:28,name:"Find the duplicate in an array of N+1 integers",topic:"Arrays/String",difficulty:"Medium",pattern:"Floyd's Cycle Detection",approach:"Treat array as linked list; find cycle entry = duplicate.",link:"https://leetcode.com/problems/find-the-duplicate-number/",solution:`public int findDuplicate(int[] nums) {
    int slow=nums[0],fast=nums[0];
    do{slow=nums[slow];fast=nums[nums[fast]];}while(slow!=fast);
    slow=nums[0];
    while(slow!=fast){slow=nums[slow];fast=nums[fast];}
    return slow;
}`},
  {id:29,name:"Grid Unique Paths",topic:"Arrays/String",difficulty:"Medium",pattern:"DP / Combinatorics",approach:"dp[i][j] = dp[i-1][j] + dp[i][j-1]. Or use C(m+n-2, m-1).",link:"https://leetcode.com/problems/unique-paths/",solution:`public int uniquePaths(int m, int n) {
    int[] dp=new int[n]; Arrays.fill(dp,1);
    for(int i=1;i<m;i++) for(int j=1;j<n;j++) dp[j]+=dp[j-1];
    return dp[n-1];
}`},
  {id:30,name:"Majority Element (n/3 times)",topic:"Arrays/String",difficulty:"Medium",pattern:"Boyer-Moore Voting (Extended)",approach:"At most 2 candidates; use two candidate counters.",link:"https://leetcode.com/problems/majority-element-ii/",solution:`public List<Integer> majorityElement(int[] nums) {
    int c1=0,c2=0,n1=0,n2=1;
    for(int n:nums){
        if(n==c1) n1++; else if(n==c2) n2++;
        else if(n1==0){c1=n;n1=1;} else if(n2==0){c2=n;n2=1;}
        else{n1--;n2--;}
    }
    n1=0;n2=0;
    for(int n:nums){if(n==c1)n1++;else if(n==c2)n2++;}
    List<Integer> res=new ArrayList<>();
    if(n1>nums.length/3)res.add(c1);
    if(n2>nums.length/3)res.add(c2);
    return res;
}`},
  {id:31,name:"Valid Palindrome",topic:"Two Pointers",difficulty:"Easy",pattern:"Two Pointers",approach:"l/r pointers skip non-alphanumeric; compare case-insensitively.",link:"https://leetcode.com/problems/valid-palindrome/",solution:`public boolean isPalindrome(String s) {
    int l=0,r=s.length()-1;
    while(l<r){
        while(l<r&&!Character.isLetterOrDigit(s.charAt(l)))l++;
        while(l<r&&!Character.isLetterOrDigit(s.charAt(r)))r--;
        if(Character.toLowerCase(s.charAt(l))!=Character.toLowerCase(s.charAt(r)))return false;
        l++;r--;
    }
    return true;
}`},
  {id:32,name:"Is Subsequence",topic:"Two Pointers",difficulty:"Easy",pattern:"Two Pointers",approach:"Move s-pointer when characters match; check if s-pointer reaches end.",link:"https://leetcode.com/problems/is-subsequence/",solution:`public boolean isSubsequence(String s, String t) {
    int i=0;
    for(char c:t.toCharArray()) if(i<s.length()&&c==s.charAt(i)) i++;
    return i==s.length();
}`},
  {id:33,name:"Two Sum II - Input Array Is Sorted",topic:"Two Pointers",difficulty:"Medium",pattern:"Two Pointers",approach:"L+R pointers; move left if sum too small, right if too large.",link:"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",solution:`public int[] twoSum(int[] nums, int target) {
    int l=0,r=nums.length-1;
    while(l<r){
        int s=nums[l]+nums[r];
        if(s==target) return new int[]{l+1,r+1};
        else if(s<target) l++; else r--;
    }
    return new int[]{};
}`},
  {id:34,name:"Container With Most Water",topic:"Two Pointers",difficulty:"Medium",pattern:"Two Pointers",approach:"Move the pointer pointing to the shorter line inward.",link:"https://leetcode.com/problems/container-with-most-water/",solution:`public int maxArea(int[] h) {
    int l=0,r=h.length-1,max=0;
    while(l<r){
        max=Math.max(max,Math.min(h[l],h[r])*(r-l));
        if(h[l]<h[r])l++; else r--;
    }
    return max;
}`},
  {id:35,name:"3Sum",topic:"Two Pointers",difficulty:"Medium",pattern:"Sort + Two Pointers",approach:"Fix one element, use two-pointer for remaining. Skip duplicates.",link:"https://leetcode.com/problems/3sum/",solution:`public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums); List<List<Integer>> res=new ArrayList<>();
    for(int i=0;i<nums.length-2;i++){
        if(i>0&&nums[i]==nums[i-1]) continue;
        int l=i+1,r=nums.length-1;
        while(l<r){
            int s=nums[i]+nums[l]+nums[r];
            if(s==0){res.add(Arrays.asList(nums[i],nums[l++],nums[r--]));
                while(l<r&&nums[l]==nums[l-1])l++;
                while(l<r&&nums[r]==nums[r+1])r--;}
            else if(s<0)l++; else r--;
        }
    }
    return res;
}`},
  {id:36,name:"Move Zeroes",topic:"Two Pointers",difficulty:"Easy",pattern:"Two Pointers",approach:"Slow pointer tracks next write position for non-zero elements.",link:"https://leetcode.com/problems/move-zeroes/",solution:`public void moveZeroes(int[] nums) {
    int k=0;
    for(int n:nums) if(n!=0) nums[k++]=n;
    while(k<nums.length) nums[k++]=0;
}`},
  {id:37,name:"Minimum Size Subarray Sum",topic:"Sliding Window",difficulty:"Medium",pattern:"Sliding Window",approach:"Expand right; shrink left whenever sum >= target. Track min window.",link:"https://leetcode.com/problems/minimum-size-subarray-sum/",solution:`public int minSubArrayLen(int target, int[] nums) {
    int l=0,sum=0,min=Integer.MAX_VALUE;
    for(int r=0;r<nums.length;r++){
        sum+=nums[r];
        while(sum>=target){min=Math.min(min,r-l+1);sum-=nums[l++];}
    }
    return min==Integer.MAX_VALUE?0:min;
}`},
  {id:38,name:"Longest Substring Without Repeating Characters",topic:"Sliding Window",difficulty:"Medium",pattern:"Sliding Window + HashMap",approach:"Map stores last index of each char; shrink window when duplicate found.",link:"https://leetcode.com/problems/longest-substring-without-repeating-characters/",solution:`public int lengthOfLongestSubstring(String s) {
    Map<Character,Integer> map=new HashMap<>();
    int max=0,l=0;
    for(int r=0;r<s.length();r++){
        char c=s.charAt(r);
        if(map.containsKey(c)) l=Math.max(l,map.get(c)+1);
        map.put(c,r); max=Math.max(max,r-l+1);
    }
    return max;
}`},
  {id:39,name:"Substring with Concatenation of All Words",topic:"Sliding Window",difficulty:"Hard",pattern:"Sliding Window + HashMap",approach:"Try each start offset [0, wordLen); use sliding window of wordLen*words.length.",link:"https://leetcode.com/problems/substring-with-concatenation-of-all-words/",solution:`public List<Integer> findSubstring(String s, String[] words) {
    List<Integer> res=new ArrayList<>();
    if(s.isEmpty()||words.length==0) return res;
    int wLen=words[0].length(),total=words.length,n=s.length();
    Map<String,Integer> freq=new HashMap<>();
    for(String w:words) freq.merge(w,1,Integer::sum);
    for(int i=0;i<wLen;i++){
        Map<String,Integer> win=new HashMap<>();
        int l=i,cnt=0;
        for(int r=i;r+wLen<=n;r+=wLen){
            String w=s.substring(r,r+wLen);
            if(freq.containsKey(w)){
                win.merge(w,1,Integer::sum); cnt++;
                while(win.get(w)>freq.get(w)){
                    String lw=s.substring(l,l+wLen);
                    win.merge(lw,-1,Integer::sum); cnt--; l+=wLen;
                }
                if(cnt==total) res.add(l);
            } else { win.clear(); cnt=0; l=r+wLen; }
        }
    }
    return res;
}`},
  {id:40,name:"Minimum Window Substring",topic:"Sliding Window",difficulty:"Hard",pattern:"Sliding Window + HashMap",approach:"Expand right until all chars covered; shrink left to minimize window.",link:"https://leetcode.com/problems/minimum-window-substring/",solution:`public String minWindow(String s, String t) {
    Map<Character,Integer> need=new HashMap<>();
    for(char c:t.toCharArray()) need.merge(c,1,Integer::sum);
    int l=0,have=0,want=need.size(),minLen=Integer.MAX_VALUE,start=0;
    Map<Character,Integer> win=new HashMap<>();
    for(int r=0;r<s.length();r++){
        char c=s.charAt(r); win.merge(c,1,Integer::sum);
        if(need.containsKey(c)&&win.get(c).equals(need.get(c))) have++;
        while(have==want){
            if(r-l+1<minLen){minLen=r-l+1;start=l;}
            char lc=s.charAt(l); win.merge(lc,-1,Integer::sum);
            if(need.containsKey(lc)&&win.get(lc)<need.get(lc)) have--;
            l++;
        }
    }
    return minLen==Integer.MAX_VALUE?"":s.substring(start,start+minLen);
}`},
  {id:41,name:"Valid Sudoku",topic:"Matrix",difficulty:"Medium",pattern:"HashSet Validation",approach:"Use sets for each row, col, and 3x3 box to detect duplicates.",link:"https://leetcode.com/problems/valid-sudoku/",solution:`public boolean isValidSudoku(char[][] board) {
    Set<String> seen=new HashSet<>();
    for(int i=0;i<9;i++) for(int j=0;j<9;j++){
        char c=board[i][j]; if(c=='.') continue;
        if(!seen.add("r"+i+c)||!seen.add("c"+j+c)||!seen.add("b"+(i/3)+(j/3)+c))return false;
    }
    return true;
}`},
  {id:42,name:"Spiral Matrix",topic:"Matrix",difficulty:"Medium",pattern:"Simulation / Boundary Shrinking",approach:"Use top/bottom/left/right boundaries; shrink after each direction pass.",link:"https://leetcode.com/problems/spiral-matrix/",solution:`public List<Integer> spiralOrder(int[][] m) {
    List<Integer> res=new ArrayList<>();
    int t=0,b=m.length-1,l=0,r=m[0].length-1;
    while(t<=b&&l<=r){
        for(int i=l;i<=r;i++) res.add(m[t][i]); t++;
        for(int i=t;i<=b;i++) res.add(m[i][r]); r--;
        if(t<=b){for(int i=r;i>=l;i--) res.add(m[b][i]); b--;}
        if(l<=r){for(int i=b;i>=t;i--) res.add(m[i][l]); l++;}
    }
    return res;
}`},
  {id:43,name:"Rotate Image",topic:"Matrix",difficulty:"Medium",pattern:"Transpose + Reverse",approach:"Transpose then reverse each row for 90° clockwise rotation.",link:"https://leetcode.com/problems/rotate-image/",solution:`public void rotate(int[][] m) {
    int n=m.length;
    for(int i=0;i<n;i++) for(int j=i;j<n;j++){int t=m[i][j];m[i][j]=m[j][i];m[j][i]=t;}
    for(int[] row:m){int l=0,r=n-1;while(l<r){int t=row[l];row[l++]=row[r];row[r--]=t;}}
}`},
  {id:44,name:"Set Matrix Zeroes",topic:"Matrix",difficulty:"Medium",pattern:"In-place Marking",approach:"Use first row/col as markers; handle first row/col separately.",link:"https://leetcode.com/problems/set-matrix-zeroes/",solution:`public void setZeroes(int[][] m) {
    boolean fr=false,fc=false;
    for(int j=0;j<m[0].length;j++) if(m[0][j]==0) fr=true;
    for(int i=0;i<m.length;i++) if(m[i][0]==0) fc=true;
    for(int i=1;i<m.length;i++) for(int j=1;j<m[0].length;j++)
        if(m[i][j]==0){m[i][0]=0;m[0][j]=0;}
    for(int i=1;i<m.length;i++) for(int j=1;j<m[0].length;j++)
        if(m[i][0]==0||m[0][j]==0) m[i][j]=0;
    if(fr) Arrays.fill(m[0],0);
    if(fc) for(int i=0;i<m.length;i++) m[i][0]=0;
}`},
  {id:45,name:"Game of Life",topic:"Matrix",difficulty:"Medium",pattern:"In-place State Encoding",approach:"Encode next state in extra bits (2=dead→live, 3=live→live).",link:"https://leetcode.com/problems/game-of-life/",solution:`public void gameOfLife(int[][] b) {
    int[] d={-1,0,1};
    for(int i=0;i<b.length;i++) for(int j=0;j<b[0].length;j++){
        int live=0;
        for(int dr:d) for(int dc:d){
            if(dr==0&&dc==0) continue;
            int r=i+dr,c=j+dc;
            if(r>=0&&r<b.length&&c>=0&&c<b[0].length&&(b[r][c]&1)==1) live++;
        }
        if(b[i][j]==1&&(live==2||live==3)) b[i][j]|=2;
        if(b[i][j]==0&&live==3) b[i][j]|=2;
    }
    for(int i=0;i<b.length;i++) for(int j=0;j<b[0].length;j++) b[i][j]>>=1;
}`},
  {id:46,name:"Linked List Cycle",topic:"Linked List",difficulty:"Easy",pattern:"Floyd's Cycle Detection",approach:"Fast/slow pointers; they meet inside the cycle if one exists.",link:"https://leetcode.com/problems/linked-list-cycle/",solution:`public boolean hasCycle(ListNode head) {
    ListNode s=head,f=head;
    while(f!=null&&f.next!=null){
        s=s.next; f=f.next.next;
        if(s==f) return true;
    }
    return false;
}`},
  {id:47,name:"Add Two Numbers",topic:"Linked List",difficulty:"Medium",pattern:"Simulation / Carry",approach:"Traverse both lists simultaneously; maintain carry.",link:"https://leetcode.com/problems/add-two-numbers/",solution:`public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy=new ListNode(0),cur=dummy; int carry=0;
    while(l1!=null||l2!=null||carry!=0){
        int s=(l1!=null?l1.val:0)+(l2!=null?l2.val:0)+carry;
        carry=s/10; cur.next=new ListNode(s%10); cur=cur.next;
        if(l1!=null)l1=l1.next; if(l2!=null)l2=l2.next;
    }
    return dummy.next;
}`},
  {id:48,name:"Merge Two Sorted Lists",topic:"Linked List",difficulty:"Easy",pattern:"Two Pointers / Recursion",approach:"Compare heads; attach smaller node, recurse.",link:"https://leetcode.com/problems/merge-two-sorted-lists/",solution:`public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if(l1==null) return l2; if(l2==null) return l1;
    if(l1.val<=l2.val){l1.next=mergeTwoLists(l1.next,l2);return l1;}
    else{l2.next=mergeTwoLists(l1,l2.next);return l2;}
}`},
  {id:49,name:"Copy List with Random Pointer",topic:"Linked List",difficulty:"Medium",pattern:"HashMap",approach:"Map original→clone; two passes: first create clones, then set next/random.",link:"https://leetcode.com/problems/copy-list-with-random-pointer/",solution:`public Node copyRandomList(Node head) {
    Map<Node,Node> map=new HashMap<>();
    Node cur=head;
    while(cur!=null){map.put(cur,new Node(cur.val));cur=cur.next;}
    cur=head;
    while(cur!=null){
        map.get(cur).next=map.get(cur.next);
        map.get(cur).random=map.get(cur.random);
        cur=cur.next;
    }
    return map.get(head);
}`},
  {id:50,name:"Reverse Linked List II",topic:"Linked List",difficulty:"Medium",pattern:"In-place Reversal",approach:"Navigate to position left; reverse m nodes using prev/curr pointers.",link:"https://leetcode.com/problems/reverse-linked-list-ii/",solution:`public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy=new ListNode(0); dummy.next=head;
    ListNode pre=dummy;
    for(int i=0;i<left-1;i++) pre=pre.next;
    ListNode cur=pre.next;
    for(int i=0;i<right-left;i++){
        ListNode next=cur.next; cur.next=next.next;
        next.next=pre.next; pre.next=next;
    }
    return dummy.next;
}`},
  {id:51,name:"Reverse Nodes in k-Group",topic:"Linked List",difficulty:"Hard",pattern:"In-place Reversal / Recursion",approach:"Count k nodes; reverse group; recurse on remaining.",link:"https://leetcode.com/problems/reverse-nodes-in-k-group/",solution:`public ListNode reverseKGroup(ListNode head, int k) {
    ListNode cur=head; int cnt=0;
    while(cur!=null&&cnt<k){cur=cur.next;cnt++;}
    if(cnt<k) return head;
    ListNode prev=null; cur=head;
    for(int i=0;i<k;i++){ListNode t=cur.next;cur.next=prev;prev=cur;cur=t;}
    head.next=reverseKGroup(cur,k);
    return prev;
}`},
  {id:52,name:"Remove Nth Node From End of List",topic:"Linked List",difficulty:"Medium",pattern:"Two Pointers (Fast/Slow)",approach:"Fast pointer advances n+1 steps; then both move until fast is null.",link:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/",solution:`public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy=new ListNode(0); dummy.next=head;
    ListNode f=dummy,s=dummy;
    for(int i=0;i<=n;i++) f=f.next;
    while(f!=null){f=f.next;s=s.next;}
    s.next=s.next.next;
    return dummy.next;
}`},
  {id:53,name:"Remove Duplicates from Sorted List II",topic:"Linked List",difficulty:"Medium",pattern:"Two Pointers",approach:"Skip all nodes that have duplicates; keep only non-repeated nodes.",link:"https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/",solution:`public ListNode deleteDuplicates(ListNode head) {
    ListNode dummy=new ListNode(0); dummy.next=head; ListNode pre=dummy;
    while(pre.next!=null){
        ListNode cur=pre.next;
        while(cur.next!=null&&cur.next.val==cur.val) cur=cur.next;
        if(cur==pre.next) pre=pre.next; else pre.next=cur.next;
    }
    return dummy.next;
}`},
  {id:54,name:"Rotate List",topic:"Linked List",difficulty:"Medium",pattern:"Cycle + Break",approach:"Connect tail to head; break at (n - k%n - 1)th node.",link:"https://leetcode.com/problems/rotate-list/",solution:`public ListNode rotateRight(ListNode head, int k) {
    if(head==null) return null;
    int n=1; ListNode tail=head;
    while(tail.next!=null){tail=tail.next;n++;}
    tail.next=head; int steps=n-k%n;
    ListNode newTail=head;
    for(int i=0;i<steps-1;i++) newTail=newTail.next;
    ListNode newHead=newTail.next; newTail.next=null;
    return newHead;
}`},
  {id:55,name:"Partition List",topic:"Linked List",difficulty:"Medium",pattern:"Two-pointer / Two Lists",approach:"Maintain two dummy-headed lists: less-than-x and greater-or-equal-x.",link:"https://leetcode.com/problems/partition-list/",solution:`public ListNode partition(ListNode head, int x) {
    ListNode d1=new ListNode(0),d2=new ListNode(0),l=d1,g=d2,cur=head;
    while(cur!=null){
        if(cur.val<x){l.next=cur;l=l.next;}
        else{g.next=cur;g=g.next;}
        cur=cur.next;
    }
    g.next=null; l.next=d2.next;
    return d1.next;
}`},
  {id:56,name:"LRU Cache",topic:"Linked List",difficulty:"Medium",pattern:"HashMap + Doubly Linked List",approach:"Map gives O(1) access; DLL gives O(1) move-to-front and eviction.",link:"https://leetcode.com/problems/lru-cache/",solution:`class LRUCache {
    int cap; Map<Integer,int[]> map=new LinkedHashMap<>();
    LRUCache(int c){cap=c;}
    public int get(int key){
        if(!map.containsKey(key))return -1;
        int v=map.remove(key)[0]; map.put(key,new int[]{v}); return v;
    }
    public void put(int key, int value){
        map.remove(key); map.put(key,new int[]{value});
        if(map.size()>cap) map.remove(map.keySet().iterator().next());
    }
}`},
  {id:57,name:"Find intersection point of Y LinkedList",topic:"Linked List",difficulty:"Medium",pattern:"Two Pointers",approach:"Both pointers traverse their list then switch; they meet at intersection.",link:"https://leetcode.com/problems/intersection-of-two-linked-lists/",solution:`public ListNode getIntersectionNode(ListNode a, ListNode b) {
    ListNode p=a,q=b;
    while(p!=q){p=(p==null?b:p.next);q=(q==null?a:q.next);}
    return p;
}`},
  {id:58,name:"Detect a cycle in Linked List",topic:"Linked List",difficulty:"Medium",pattern:"Floyd's Cycle Detection",approach:"Fast/slow pointers meet → cycle exists.",link:"https://leetcode.com/problems/linked-list-cycle/",solution:`public boolean hasCycle(ListNode head) {
    ListNode s=head,f=head;
    while(f!=null&&f.next!=null){s=s.next;f=f.next.next;if(s==f)return true;}
    return false;
}`},
  {id:59,name:"Reverse a LinkedList in groups of size k",topic:"Linked List",difficulty:"Hard",pattern:"In-place Reversal",approach:"Count k nodes, reverse group, recurse.",link:"https://leetcode.com/problems/reverse-nodes-in-k-group/",solution:`public ListNode reverseKGroup(ListNode head, int k) {
    ListNode cur=head; int cnt=0;
    while(cur!=null&&cnt<k){cur=cur.next;cnt++;}
    if(cnt<k) return head;
    ListNode prev=null; cur=head;
    for(int i=0;i<k;i++){ListNode t=cur.next;cur.next=prev;prev=cur;cur=t;}
    head.next=reverseKGroup(cur,k);
    return prev;
}`},
  {id:60,name:"Check if a LinkedList is palindrome or not",topic:"Linked List",difficulty:"Medium",pattern:"Fast/Slow Pointer + Reverse",approach:"Find middle, reverse second half, compare both halves.",link:"https://leetcode.com/problems/palindrome-linked-list/",solution:`public boolean isPalindrome(ListNode head) {
    ListNode s=head,f=head;
    while(f!=null&&f.next!=null){s=s.next;f=f.next.next;}
    ListNode prev=null,cur=s;
    while(cur!=null){ListNode t=cur.next;cur.next=prev;prev=cur;cur=t;}
    while(prev!=null){if(prev.val!=head.val)return false;prev=prev.next;head=head.next;}
    return true;
}`},
  {id:61,name:"Find the starting point of the Loop of LinkedList",topic:"Linked List",difficulty:"Medium",pattern:"Floyd's Cycle + Math",approach:"After meeting, reset one pointer to head; advance both by 1 to find entry.",link:"https://leetcode.com/problems/linked-list-cycle-ii/",solution:`public ListNode detectCycle(ListNode head) {
    ListNode s=head,f=head;
    while(f!=null&&f.next!=null){s=s.next;f=f.next.next;if(s==f){s=head;while(s!=f){s=s.next;f=f.next;}return s;}}
    return null;
}`},
  {id:62,name:"Flattening of a LinkedList",topic:"Linked List",difficulty:"Hard",pattern:"Recursion + Merge",approach:"Recursively flatten next, then merge current child list with it.",link:"https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",solution:`public Node flatten(Node head) {
    if(head==null) return null;
    Node cur=head;
    while(cur!=null){
        if(cur.child!=null){
            Node child=flatten(cur.child); Node next=cur.next;
            cur.next=child; child.prev=cur; cur.child=null;
            while(cur.next!=null) cur=cur.next;
            if(next!=null){cur.next=next;next.prev=cur;}
        }
        cur=cur.next;
    }
    return head;
}`},
  {id:63,name:"Valid Parentheses",topic:"Stack",difficulty:"Easy",pattern:"Stack",approach:"Push open brackets; on close bracket check stack top matches.",link:"https://leetcode.com/problems/valid-parentheses/",solution:`public boolean isValid(String s) {
    Deque<Character> st=new ArrayDeque<>();
    for(char c:s.toCharArray()){
        if(c=='('||c=='['||c=='{') st.push(c);
        else{
            if(st.isEmpty())return false;
            char t=st.pop();
            if(c==')'&&t!='('||c==']'&&t!='['||c=='}'&&t!='{')return false;
        }
    }
    return st.isEmpty();
}`},
  {id:64,name:"Simplify Path",topic:"Stack",difficulty:"Medium",pattern:"Stack + String Parsing",approach:"Split by '/'; push dirs, pop on '..', ignore '.' and empty.",link:"https://leetcode.com/problems/simplify-path/",solution:`public String simplifyPath(String path) {
    Deque<String> st=new ArrayDeque<>();
    for(String p:path.split("/")){
        if(p.equals("..")){if(!st.isEmpty())st.pop();}
        else if(!p.isEmpty()&&!p.equals(".")) st.push(p);
    }
    StringBuilder sb=new StringBuilder();
    for(String s:st) sb.insert(0,"/"+s);
    return sb.length()==0?"/":sb.toString();
}`},
  {id:65,name:"Min Stack",topic:"Stack",difficulty:"Medium",pattern:"Stack with Auxiliary Stack",approach:"Maintain a secondary stack that tracks current minimum at each level.",link:"https://leetcode.com/problems/min-stack/",solution:`class MinStack {
    Deque<Integer> st=new ArrayDeque<>(), minSt=new ArrayDeque<>();
    public void push(int v){
        st.push(v);
        minSt.push(minSt.isEmpty()?v:Math.min(v,minSt.peek()));
    }
    public void pop(){st.pop();minSt.pop();}
    public int top(){return st.peek();}
    public int getMin(){return minSt.peek();}
}`},
  {id:66,name:"Evaluate Reverse Polish Notation",topic:"Stack",difficulty:"Medium",pattern:"Stack",approach:"Push numbers; on operator pop two, compute, push result.",link:"https://leetcode.com/problems/evaluate-reverse-polish-notation/",solution:`public int evalRPN(String[] tokens) {
    Deque<Integer> st=new ArrayDeque<>();
    for(String t:tokens){
        if("+-*/".contains(t)){
            int b=st.pop(),a=st.pop();
            st.push(t.equals("+")?a+b:t.equals("-")?a-b:t.equals("*")?a*b:a/b);
        } else st.push(Integer.parseInt(t));
    }
    return st.pop();
}`},
  {id:67,name:"Basic Calculator",topic:"Stack",difficulty:"Hard",pattern:"Stack + Recursion",approach:"Use stack to handle parentheses; track sign and running result.",link:"https://leetcode.com/problems/basic-calculator/",solution:`public int calculate(String s) {
    Deque<Integer> st=new ArrayDeque<>();
    int res=0,sign=1,num=0;
    for(char c:s.toCharArray()){
        if(Character.isDigit(c)) num=num*10+(c-'0');
        else if(c=='+'){res+=sign*num;num=0;sign=1;}
        else if(c=='-'){res+=sign*num;num=0;sign=-1;}
        else if(c=='('){st.push(res);st.push(sign);res=0;sign=1;}
        else if(c==')'){res+=sign*num;num=0;res*=st.pop();res+=st.pop();}
    }
    return res+sign*num;
}`},
  {id:68,name:"Largest Rectangle in a Histogram",topic:"Stack",difficulty:"Medium",pattern:"Monotonic Stack",approach:"Use a stack of indices in increasing height order; pop and compute area when smaller bar found.",link:"https://leetcode.com/problems/largest-rectangle-in-histogram/",solution:`public int largestRectangleArea(int[] h) {
    Deque<Integer> st=new ArrayDeque<>(); int max=0;
    int[] heights=Arrays.copyOf(h,h.length+1);
    for(int i=0;i<heights.length;i++){
        while(!st.isEmpty()&&heights[i]<heights[st.peek()]){
            int height=heights[st.pop()];
            int width=st.isEmpty()?i:i-st.peek()-1;
            max=Math.max(max,height*width);
        }
        st.push(i);
    }
    return max;
}`},
  {id:69,name:"Sliding Window Maximum",topic:"Stack",difficulty:"Hard",pattern:"Monotonic Deque",approach:"Maintain deque of indices in decreasing order; front is always the max.",link:"https://leetcode.com/problems/sliding-window-maximum/",solution:`public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq=new ArrayDeque<>();
    int[] res=new int[nums.length-k+1];
    for(int i=0;i<nums.length;i++){
        while(!dq.isEmpty()&&dq.peek()<i-k+1) dq.poll();
        while(!dq.isEmpty()&&nums[dq.peekLast()]<nums[i]) dq.pollLast();
        dq.offer(i);
        if(i>=k-1) res[i-k+1]=nums[dq.peek()];
    }
    return res;
}`},
  {id:70,name:"Implement Min Stack",topic:"Stack",difficulty:"Medium",pattern:"Stack with Auxiliary Stack",approach:"Same as Min Stack (#65).",link:"https://leetcode.com/problems/min-stack/",solution:`// Same solution as Min Stack
class MinStack {
    Deque<Integer> st=new ArrayDeque<>(), minSt=new ArrayDeque<>();
    public void push(int v){st.push(v);minSt.push(minSt.isEmpty()?v:Math.min(v,minSt.peek()));}
    public void pop(){st.pop();minSt.pop();}
    public int top(){return st.peek();}
    public int getMin(){return minSt.peek();}
}`},
  {id:71,name:"Rotten Orange (Using BFS)",topic:"Stack",difficulty:"Medium",pattern:"BFS / Multi-source BFS",approach:"Start BFS from all rotten oranges simultaneously; track time (levels).",link:"https://leetcode.com/problems/rotting-oranges/",solution:`public int orangesRotting(int[][] grid) {
    Queue<int[]> q=new LinkedList<>();int fresh=0,time=0;
    int m=grid.length,n=grid[0].length;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(grid[i][j]==2) q.offer(new int[]{i,j});
        else if(grid[i][j]==1) fresh++;
    }
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()&&fresh>0){
        time++;
        for(int k=q.size();k>0;k--){
            int[] cell=q.poll();
            for(int[] d:dirs){
                int r=cell[0]+d[0],c=cell[1]+d[1];
                if(r>=0&&r<m&&c>=0&&c<n&&grid[r][c]==1){grid[r][c]=2;fresh--;q.offer(new int[]{r,c});}
            }
        }
    }
    return fresh==0?time:-1;
}`},
  {id:72,name:"Stock Span Problem",topic:"Stack",difficulty:"Medium",pattern:"Monotonic Stack",approach:"Stack stores indices of days with higher prices; span = current index - stack top.",link:"https://leetcode.com/problems/online-stock-span/",solution:`class StockSpanner {
    Deque<int[]> st=new ArrayDeque<>();
    public int next(int price) {
        int span=1;
        while(!st.isEmpty()&&st.peek()[0]<=price) span+=st.pop()[1];
        st.push(new int[]{price,span});
        return span;
    }
}`},
  {id:73,name:"Find the Maximum of Minimums of Every Window Size",topic:"Stack",difficulty:"Medium",pattern:"Monotonic Stack",approach:"For each element find prev/next smaller to determine windows where it's minimum.",link:"https://leetcode.com/problems/sum-of-subarray-minimums/",solution:`public int[] maxMinWindow(int[] arr) {
    int n=arr.length; int[] res=new int[n+1], left=new int[n], right=new int[n];
    Deque<Integer> st=new ArrayDeque<>();
    for(int i=0;i<n;i++){while(!st.isEmpty()&&arr[st.peek()]>=arr[i])st.pop();left[i]=st.isEmpty()?-1:st.peek();st.push(i);}
    st.clear();
    for(int i=n-1;i>=0;i--){while(!st.isEmpty()&&arr[st.peek()]>=arr[i])st.pop();right[i]=st.isEmpty()?n:st.peek();st.push(i);}
    for(int i=0;i<n;i++){int len=right[i]-left[i]-1;res[len]=Math.max(res[len],arr[i]);}
    for(int i=n-1;i>=1;i--) res[i]=Math.max(res[i],res[i+1]);
    return Arrays.copyOfRange(res,1,n+1);
}`},
  {id:74,name:"The Celebrity Problem",topic:"Stack",difficulty:"Hard",pattern:"Two Pointers / Elimination",approach:"Eliminate non-celebrities: if A knows B, A can't be celebrity; otherwise B can't.",link:"https://leetcode.com/problems/find-the-celebrity/",solution:`public int findCelebrity(int n) {
    int cand=0;
    for(int i=1;i<n;i++) if(knows(cand,i)) cand=i;
    for(int i=0;i<n;i++){
        if(i!=cand&&(knows(cand,i)||!knows(i,cand))) return -1;
    }
    return cand;
}`},
  {id:75,name:"Subset Sums",topic:"Recursion",difficulty:"Medium",pattern:"Backtracking",approach:"At each index: include or exclude element. Recurse on both choices.",link:"https://leetcode.com/problems/subsets/",solution:`public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res=new ArrayList<>();
    backtrack(nums,0,new ArrayList<>(),res);
    return res;
}
private void backtrack(int[] nums,int idx,List<Integer> cur,List<List<Integer>> res){
    res.add(new ArrayList<>(cur));
    for(int i=idx;i<nums.length;i++){cur.add(nums[i]);backtrack(nums,i+1,cur,res);cur.remove(cur.size()-1);}
}`},
  {id:76,name:"Subset-II",topic:"Recursion",difficulty:"Medium",pattern:"Backtracking + Skip Duplicates",approach:"Sort first; skip duplicate elements at same recursion level.",link:"https://leetcode.com/problems/subsets-ii/",solution:`public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums); List<List<Integer>> res=new ArrayList<>();
    backtrack(nums,0,new ArrayList<>(),res); return res;
}
private void backtrack(int[] nums,int idx,List<Integer> cur,List<List<Integer>> res){
    res.add(new ArrayList<>(cur));
    for(int i=idx;i<nums.length;i++){
        if(i>idx&&nums[i]==nums[i-1]) continue;
        cur.add(nums[i]);backtrack(nums,i+1,cur,res);cur.remove(cur.size()-1);
    }
}`},
  {id:77,name:"Combination Sum-1",topic:"Recursion",difficulty:"Medium",pattern:"Backtracking",approach:"Can reuse same element; continue from same index. Prune when sum > target.",link:"https://leetcode.com/problems/combination-sum/",solution:`public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> res=new ArrayList<>();
    backtrack(candidates,0,target,new ArrayList<>(),res); return res;
}
private void backtrack(int[] c,int idx,int rem,List<Integer> cur,List<List<Integer>> res){
    if(rem==0){res.add(new ArrayList<>(cur));return;}
    for(int i=idx;i<c.length;i++){
        if(c[i]<=rem){cur.add(c[i]);backtrack(c,i,rem-c[i],cur,res);cur.remove(cur.size()-1);}
    }
}`},
  {id:78,name:"Combination Sum-2",topic:"Recursion",difficulty:"Medium",pattern:"Backtracking + Skip Duplicates",approach:"Sort; skip duplicates at same level; each element used once.",link:"https://leetcode.com/problems/combination-sum-ii/",solution:`public List<List<Integer>> combinationSum2(int[] c, int target) {
    Arrays.sort(c); List<List<Integer>> res=new ArrayList<>();
    backtrack(c,0,target,new ArrayList<>(),res); return res;
}
private void backtrack(int[] c,int idx,int rem,List<Integer> cur,List<List<Integer>> res){
    if(rem==0){res.add(new ArrayList<>(cur));return;}
    for(int i=idx;i<c.length;i++){
        if(i>idx&&c[i]==c[i-1]) continue;
        if(c[i]>rem) break;
        cur.add(c[i]);backtrack(c,i+1,rem-c[i],cur,res);cur.remove(cur.size()-1);
    }
}`},
  {id:79,name:"Palindrome Partitioning",topic:"Recursion",difficulty:"Medium",pattern:"Backtracking + DP",approach:"Try every prefix; if palindrome, recurse on remaining string.",link:"https://leetcode.com/problems/palindrome-partitioning/",solution:`public List<List<String>> partition(String s) {
    List<List<String>> res=new ArrayList<>();
    backtrack(s,0,new ArrayList<>(),res); return res;
}
private void backtrack(String s,int idx,List<String> cur,List<List<String>> res){
    if(idx==s.length()){res.add(new ArrayList<>(cur));return;}
    for(int end=idx+1;end<=s.length();end++){
        String sub=s.substring(idx,end);
        if(isPalin(sub)){cur.add(sub);backtrack(s,end,cur,res);cur.remove(cur.size()-1);}
    }
}
private boolean isPalin(String s){int l=0,r=s.length()-1;while(l<r)if(s.charAt(l++)!=s.charAt(r--))return false;return true;}`},
  {id:80,name:"K-th Permutation Sequence",topic:"Recursion",difficulty:"Hard",pattern:"Math / Factoradic",approach:"Use factorial to determine which digit goes at each position.",link:"https://leetcode.com/problems/permutation-sequence/",solution:`public String getPermutation(int n, int k) {
    int[] fact=new int[n+1]; fact[0]=1;
    List<Integer> nums=new ArrayList<>();
    for(int i=1;i<=n;i++){fact[i]=fact[i-1]*i;nums.add(i);}
    k--;
    StringBuilder sb=new StringBuilder();
    for(int i=n;i>=1;i--){
        int idx=k/fact[i-1]; sb.append(nums.remove(idx)); k%=fact[i-1];
    }
    return sb.toString();
}`},
  {id:81,name:"Maximum Depth of Binary Tree",topic:"Binary Tree",difficulty:"Easy",pattern:"DFS Recursion",approach:"max(leftDepth, rightDepth) + 1.",link:"https://leetcode.com/problems/maximum-depth-of-binary-tree/",solution:`public int maxDepth(TreeNode root) {
    if(root==null) return 0;
    return 1+Math.max(maxDepth(root.left),maxDepth(root.right));
}`},
  {id:82,name:"Same Tree",topic:"Binary Tree",difficulty:"Easy",pattern:"DFS Recursion",approach:"Both null → true; one null or vals differ → false; recurse on children.",link:"https://leetcode.com/problems/same-tree/",solution:`public boolean isSameTree(TreeNode p, TreeNode q) {
    if(p==null&&q==null) return true;
    if(p==null||q==null||p.val!=q.val) return false;
    return isSameTree(p.left,q.left)&&isSameTree(p.right,q.right);
}`},
  {id:83,name:"Invert Binary Tree",topic:"Binary Tree",difficulty:"Easy",pattern:"DFS Recursion",approach:"Swap left and right children, recurse on both.",link:"https://leetcode.com/problems/invert-binary-tree/",solution:`public TreeNode invertTree(TreeNode root) {
    if(root==null) return null;
    TreeNode t=root.left; root.left=invertTree(root.right); root.right=invertTree(t);
    return root;
}`},
  {id:84,name:"Symmetric Tree",topic:"Binary Tree",difficulty:"Easy",pattern:"DFS Recursion",approach:"Compare mirror nodes: left.left with right.right and left.right with right.left.",link:"https://leetcode.com/problems/symmetric-tree/",solution:`public boolean isSymmetric(TreeNode root) {
    return check(root.left,root.right);
}
private boolean check(TreeNode l, TreeNode r){
    if(l==null&&r==null) return true;
    if(l==null||r==null||l.val!=r.val) return false;
    return check(l.left,r.right)&&check(l.right,r.left);
}`},
  {id:85,name:"Construct Binary Tree from Preorder and Inorder Traversal",topic:"Binary Tree",difficulty:"Medium",pattern:"Recursion + HashMap",approach:"Preorder[0] = root; find in inorder to split left/right subtrees.",link:"https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",solution:`public TreeNode buildTree(int[] pre, int[] in) {
    Map<Integer,Integer> map=new HashMap<>();
    for(int i=0;i<in.length;i++) map.put(in[i],i);
    return build(pre,0,pre.length-1,0,in.length-1,map);
}
private TreeNode build(int[] pre,int ps,int pe,int is,int ie,Map<Integer,Integer> map){
    if(ps>pe) return null;
    TreeNode root=new TreeNode(pre[ps]);
    int mid=map.get(pre[ps]),leftSize=mid-is;
    root.left=build(pre,ps+1,ps+leftSize,is,mid-1,map);
    root.right=build(pre,ps+leftSize+1,pe,mid+1,ie,map);
    return root;
}`},
  {id:86,name:"Construct Binary Tree from Inorder and Postorder Traversal",topic:"Binary Tree",difficulty:"Medium",pattern:"Recursion + HashMap",approach:"Postorder last = root; split inorder around root.",link:"https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",solution:`public TreeNode buildTree(int[] in, int[] post) {
    Map<Integer,Integer> map=new HashMap<>();
    for(int i=0;i<in.length;i++) map.put(in[i],i);
    return build(in,0,in.length-1,post,0,post.length-1,map);
}
private TreeNode build(int[] in,int is,int ie,int[] post,int ps,int pe,Map<Integer,Integer> map){
    if(ps>pe) return null;
    TreeNode root=new TreeNode(post[pe]);
    int mid=map.get(post[pe]),leftSize=mid-is;
    root.left=build(in,is,mid-1,post,ps,ps+leftSize-1,map);
    root.right=build(in,mid+1,ie,post,ps+leftSize,pe-1,map);
    return root;
}`},
  {id:87,name:"Populating Next Right Pointers in Each Node II",topic:"Binary Tree",difficulty:"Medium",pattern:"BFS Level Order",approach:"Process nodes level by level using BFS; link next pointers across each level.",link:"https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/",solution:`public Node connect(Node root) {
    if(root==null) return null;
    Queue<Node> q=new LinkedList<>(); q.offer(root);
    while(!q.isEmpty()){
        int sz=q.size(); Node prev=null;
        for(int i=0;i<sz;i++){
            Node cur=q.poll();
            if(prev!=null) prev.next=cur; prev=cur;
            if(cur.left!=null) q.offer(cur.left);
            if(cur.right!=null) q.offer(cur.right);
        }
    }
    return root;
}`},
  {id:88,name:"Flatten Binary Tree to Linked List",topic:"Binary Tree",difficulty:"Medium",pattern:"Morris Traversal / Reverse Postorder",approach:"Traverse in reverse postorder (right→left→root); attach each node as head.right.",link:"https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",solution:`public void flatten(TreeNode root) {
    TreeNode cur=root,prev=null;
    while(cur!=null){
        if(cur.left!=null){
            TreeNode pred=cur.left;
            while(pred.right!=null) pred=pred.right;
            pred.right=cur.right; cur.right=cur.left; cur.left=null;
        }
        cur=cur.right;
    }
}`},
  {id:89,name:"Path Sum",topic:"Binary Tree",difficulty:"Easy",pattern:"DFS Recursion",approach:"Subtract val at each node; return true if leaf with remaining sum = 0.",link:"https://leetcode.com/problems/path-sum/",solution:`public boolean hasPathSum(TreeNode root, int sum) {
    if(root==null) return false;
    if(root.left==null&&root.right==null) return sum==root.val;
    return hasPathSum(root.left,sum-root.val)||hasPathSum(root.right,sum-root.val);
}`},
  {id:90,name:"Sum Root to Leaf Numbers",topic:"Binary Tree",difficulty:"Medium",pattern:"DFS Recursion",approach:"Pass current number (num*10+node.val) down; add at leaves.",link:"https://leetcode.com/problems/sum-root-to-leaf-numbers/",solution:`public int sumNumbers(TreeNode root) { return dfs(root,0); }
private int dfs(TreeNode n, int cur){
    if(n==null) return 0;
    cur=cur*10+n.val;
    if(n.left==null&&n.right==null) return cur;
    return dfs(n.left,cur)+dfs(n.right,cur);
}`},
  {id:91,name:"Binary Tree Maximum Path Sum",topic:"Binary Tree",difficulty:"Hard",pattern:"DFS + Global Max",approach:"At each node: max gain = max(left,0)+max(right,0)+val. Update global max. Return val + max(left,right,0).",link:"https://leetcode.com/problems/binary-tree-maximum-path-sum/",solution:`int max=Integer.MIN_VALUE;
public int maxPathSum(TreeNode root) { dfs(root); return max; }
private int dfs(TreeNode n){
    if(n==null) return 0;
    int l=Math.max(0,dfs(n.left)),r=Math.max(0,dfs(n.right));
    max=Math.max(max,l+r+n.val);
    return n.val+Math.max(l,r);
}`},
  {id:92,name:"Binary Search Tree Iterator",topic:"Binary Tree",difficulty:"Medium",pattern:"Controlled In-order DFS",approach:"Use stack; push left spine on init; on next(), pop, push right spine of popped node.",link:"https://leetcode.com/problems/binary-search-tree-iterator/",solution:`class BSTIterator {
    Deque<TreeNode> st=new ArrayDeque<>();
    BSTIterator(TreeNode root){ pushLeft(root); }
    private void pushLeft(TreeNode n){ while(n!=null){st.push(n);n=n.left;} }
    public int next(){ TreeNode n=st.pop(); pushLeft(n.right); return n.val; }
    public boolean hasNext(){ return !st.isEmpty(); }
}`},
  {id:93,name:"Count Complete Tree Nodes",topic:"Binary Tree",difficulty:"Easy",pattern:"Binary Search on Height",approach:"Compare left and right heights; if equal, left subtree is perfect; recurse on other side.",link:"https://leetcode.com/problems/count-complete-tree-nodes/",solution:`public int countNodes(TreeNode root) {
    if(root==null) return 0;
    int lh=0,rh=0; TreeNode l=root,r=root;
    while(l!=null){lh++;l=l.left;} while(r!=null){rh++;r=r.right;}
    if(lh==rh) return (1<<lh)-1;
    return 1+countNodes(root.left)+countNodes(root.right);
}`},
  {id:94,name:"Lowest Common Ancestor of a Binary Tree",topic:"Binary Tree",difficulty:"Medium",pattern:"DFS Post-order",approach:"If root matches p or q return root; LCA is where left and right both return non-null.",link:"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",solution:`public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if(root==null||root==p||root==q) return root;
    TreeNode left=lowestCommonAncestor(root.left,p,q);
    TreeNode right=lowestCommonAncestor(root.right,p,q);
    return left==null?right:right==null?left:root;
}`},
  {id:95,name:"Binary Tree Right Side View",topic:"Binary Tree BFS",difficulty:"Medium",pattern:"BFS Level Order",approach:"BFS; add last node of each level to result.",link:"https://leetcode.com/problems/binary-tree-right-side-view/",solution:`public List<Integer> rightSideView(TreeNode root) {
    List<Integer> res=new ArrayList<>();
    if(root==null) return res;
    Queue<TreeNode> q=new LinkedList<>(); q.offer(root);
    while(!q.isEmpty()){
        int sz=q.size(); TreeNode last=null;
        for(int i=0;i<sz;i++){last=q.poll();if(last.left!=null)q.offer(last.left);if(last.right!=null)q.offer(last.right);}
        res.add(last.val);
    }
    return res;
}`},
  {id:96,name:"Average of Levels in Binary Tree",topic:"Binary Tree BFS",difficulty:"Easy",pattern:"BFS Level Order",approach:"BFS; compute average of each level.",link:"https://leetcode.com/problems/average-of-levels-in-binary-tree/",solution:`public List<Double> averageOfLevels(TreeNode root) {
    List<Double> res=new ArrayList<>();
    Queue<TreeNode> q=new LinkedList<>(); q.offer(root);
    while(!q.isEmpty()){
        int sz=q.size(); double sum=0;
        for(int i=0;i<sz;i++){TreeNode n=q.poll();sum+=n.val;if(n.left!=null)q.offer(n.left);if(n.right!=null)q.offer(n.right);}
        res.add(sum/sz);
    }
    return res;
}`},
  {id:97,name:"Binary Tree Level Order Traversal",topic:"Binary Tree BFS",difficulty:"Medium",pattern:"BFS Level Order",approach:"BFS with level size tracking; collect each level into a list.",link:"https://leetcode.com/problems/binary-tree-level-order-traversal/",solution:`public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res=new ArrayList<>();
    if(root==null) return res;
    Queue<TreeNode> q=new LinkedList<>(); q.offer(root);
    while(!q.isEmpty()){
        int sz=q.size(); List<Integer> level=new ArrayList<>();
        for(int i=0;i<sz;i++){TreeNode n=q.poll();level.add(n.val);if(n.left!=null)q.offer(n.left);if(n.right!=null)q.offer(n.right);}
        res.add(level);
    }
    return res;
}`},
  {id:98,name:"Binary Tree Zigzag Level Order Traversal",topic:"Binary Tree BFS",difficulty:"Medium",pattern:"BFS + Direction Flag",approach:"BFS; alternate adding to front/back of deque based on level parity.",link:"https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",solution:`public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> res=new ArrayList<>();
    if(root==null) return res;
    Queue<TreeNode> q=new LinkedList<>(); q.offer(root); boolean ltr=true;
    while(!q.isEmpty()){
        int sz=q.size(); LinkedList<Integer> level=new LinkedList<>();
        for(int i=0;i<sz;i++){TreeNode n=q.poll();if(ltr)level.addLast(n.val);else level.addFirst(n.val);if(n.left!=null)q.offer(n.left);if(n.right!=null)q.offer(n.right);}
        res.add(level); ltr=!ltr;
    }
    return res;
}`},
  {id:99,name:"Minimum Absolute Difference in BST",topic:"Binary Search Tree",difficulty:"Easy",pattern:"In-order Traversal",approach:"In-order gives sorted values; min diff = min of consecutive differences.",link:"https://leetcode.com/problems/minimum-absolute-difference-in-bst/",solution:`int min=Integer.MAX_VALUE,prev=-1;
public int getMinimumDifference(TreeNode root) {
    if(root==null) return min;
    getMinimumDifference(root.left);
    if(prev!=-1) min=Math.min(min,root.val-prev);
    prev=root.val;
    getMinimumDifference(root.right);
    return min;
}`},
  {id:100,name:"Kth Smallest Element in a BST",topic:"Binary Search Tree",difficulty:"Medium",pattern:"In-order Traversal",approach:"In-order is sorted; count and return kth node.",link:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/",solution:`int cnt=0,res=0;
public int kthSmallest(TreeNode root, int k) {
    inorder(root,k); return res;
}
private void inorder(TreeNode n, int k){
    if(n==null) return;
    inorder(n.left,k);
    if(++cnt==k){res=n.val;return;}
    inorder(n.right,k);
}`},
  {id:101,name:"Validate Binary Search Tree",topic:"Binary Search Tree",difficulty:"Medium",pattern:"DFS with Range",approach:"Pass min/max bounds; every node must lie strictly within its bounds.",link:"https://leetcode.com/problems/validate-binary-search-tree/",solution:`public boolean isValidBST(TreeNode root) {
    return validate(root,Long.MIN_VALUE,Long.MAX_VALUE);
}
private boolean validate(TreeNode n, long min, long max){
    if(n==null) return true;
    if(n.val<=min||n.val>=max) return false;
    return validate(n.left,min,n.val)&&validate(n.right,n.val,max);
}`},
  {id:103,name:"Number of Islands",topic:"Graph",difficulty:"Medium",pattern:"DFS/BFS Grid",approach:"DFS from each unvisited '1', mark visited cells. Count DFS calls.",link:"https://leetcode.com/problems/number-of-islands/",solution:`public int numIslands(char[][] grid) {
    int cnt=0;
    for(int i=0;i<grid.length;i++) for(int j=0;j<grid[0].length;j++)
        if(grid[i][j]=='1'){dfs(grid,i,j);cnt++;}
    return cnt;
}
private void dfs(char[][] g,int i,int j){
    if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!='1') return;
    g[i][j]='0'; dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);
}`},
  {id:104,name:"Surrounded Regions",topic:"Graph",difficulty:"Medium",pattern:"DFS from Boundary",approach:"Mark border-connected 'O's as safe; fill remaining 'O's with 'X'.",link:"https://leetcode.com/problems/surrounded-regions/",solution:`public void solve(char[][] b) {
    int m=b.length,n=b[0].length;
    for(int i=0;i<m;i++){dfs(b,i,0);dfs(b,i,n-1);}
    for(int j=0;j<n;j++){dfs(b,0,j);dfs(b,m-1,j);}
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        b[i][j]=b[i][j]=='S'?'O':'X';
}
private void dfs(char[][] b,int i,int j){
    if(i<0||i>=b.length||j<0||j>=b[0].length||b[i][j]!='O') return;
    b[i][j]='S'; dfs(b,i+1,j);dfs(b,i-1,j);dfs(b,i,j+1);dfs(b,i,j-1);
}`},
  {id:105,name:"Clone Graph",topic:"Graph",difficulty:"Medium",pattern:"DFS/BFS + HashMap",approach:"Map original→clone; DFS to clone all neighbors.",link:"https://leetcode.com/problems/clone-graph/",solution:`public Node cloneGraph(Node node) {
    if(node==null) return null;
    Map<Node,Node> map=new HashMap<>();
    return dfs(node,map);
}
private Node dfs(Node n, Map<Node,Node> map){
    if(map.containsKey(n)) return map.get(n);
    Node clone=new Node(n.val); map.put(n,clone);
    for(Node nb:n.neighbors) clone.neighbors.add(dfs(nb,map));
    return clone;
}`},
  {id:106,name:"Evaluate Division",topic:"Graph",difficulty:"Medium",pattern:"Weighted Graph BFS/DFS",approach:"Build weighted graph of equations; BFS/DFS to find path product.",link:"https://leetcode.com/problems/evaluate-division/",solution:`public double[] calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
    Map<String,Map<String,Double>> g=new HashMap<>();
    for(int i=0;i<equations.size();i++){
        String a=equations.get(i).get(0),b=equations.get(i).get(1);
        g.computeIfAbsent(a,x->new HashMap<>()).put(b,values[i]);
        g.computeIfAbsent(b,x->new HashMap<>()).put(a,1.0/values[i]);
    }
    double[] res=new double[queries.size()];
    for(int i=0;i<queries.size();i++){
        String s=queries.get(i).get(0),t=queries.get(i).get(1);
        res[i]=bfs(g,s,t);
    }
    return res;
}
private double bfs(Map<String,Map<String,Double>> g,String s,String t){
    if(!g.containsKey(s)||!g.containsKey(t)) return -1.0;
    Queue<Object[]> q=new LinkedList<>(); Set<String> vis=new HashSet<>();
    q.offer(new Object[]{s,1.0}); vis.add(s);
    while(!q.isEmpty()){
        Object[] cur=q.poll(); String node=(String)cur[0]; double prod=(double)cur[1];
        if(node.equals(t)) return prod;
        for(Map.Entry<String,Double> e:g.get(node).entrySet())
            if(vis.add(e.getKey())) q.offer(new Object[]{e.getKey(),prod*e.getValue()});
    }
    return -1.0;
}`},
  {id:107,name:"Course Schedule",topic:"Graph",difficulty:"Medium",pattern:"Topological Sort / Cycle Detection",approach:"Build adjacency list; DFS to detect cycle (visiting → cycle exists).",link:"https://leetcode.com/problems/course-schedule/",solution:`public boolean canFinish(int n, int[][] pre) {
    List<List<Integer>> g=new ArrayList<>();
    for(int i=0;i<n;i++) g.add(new ArrayList<>());
    for(int[] p:pre) g.get(p[0]).add(p[1]);
    int[] state=new int[n]; // 0=unvisited,1=visiting,2=done
    for(int i=0;i<n;i++) if(dfs(g,state,i)) return false;
    return true;
}
private boolean dfs(List<List<Integer>> g,int[] state,int node){
    if(state[node]==1) return true; if(state[node]==2) return false;
    state[node]=1;
    for(int nb:g.get(node)) if(dfs(g,state,nb)) return true;
    state[node]=2; return false;
}`},
  {id:108,name:"Course Schedule II",topic:"Graph",difficulty:"Medium",pattern:"Topological Sort (Kahn's / DFS)",approach:"Kahn's: track in-degree; BFS with queue of 0-in-degree nodes.",link:"https://leetcode.com/problems/course-schedule-ii/",solution:`public int[] findOrder(int n, int[][] pre) {
    List<List<Integer>> g=new ArrayList<>(); int[] indeg=new int[n];
    for(int i=0;i<n;i++) g.add(new ArrayList<>());
    for(int[] p:pre){g.get(p[1]).add(p[0]);indeg[p[0]]++;}
    Queue<Integer> q=new LinkedList<>();
    for(int i=0;i<n;i++) if(indeg[i]==0) q.offer(i);
    int[] res=new int[n]; int idx=0;
    while(!q.isEmpty()){
        int cur=q.poll(); res[idx++]=cur;
        for(int nb:g.get(cur)) if(--indeg[nb]==0) q.offer(nb);
    }
    return idx==n?res:new int[]{};
}`},
  {id:109,name:"Snakes and Ladders",topic:"Graph BFS",difficulty:"Medium",pattern:"BFS on Grid",approach:"BFS from cell 1; use board mapping to handle snakes/ladders.",link:"https://leetcode.com/problems/snakes-and-ladders/",solution:`public int snakesAndLadders(int[][] board) {
    int n=board.length; int[] flat=new int[n*n+1];
    boolean left=false; int idx=1;
    for(int i=n-1;i>=0;i--,left=!left){
        int[] row=left?board[i]:new int[n];
        if(!left) for(int j=0;j<n;j++) row[j]=board[i][j];
        for(int j=left?n-1:0;left?j>=0:j<n;j+=left?-1:1) flat[idx++]=row[j];
    }
    Queue<int[]> q=new LinkedList<>(); q.offer(new int[]{1,0});
    boolean[] vis=new boolean[n*n+1]; vis[1]=true;
    while(!q.isEmpty()){
        int[] cur=q.poll(); int pos=cur[0],moves=cur[1];
        for(int d=1;d<=6;d++){
            int nxt=pos+d; if(nxt>n*n) break;
            if(flat[nxt]!=-1) nxt=flat[nxt];
            if(!vis[nxt]){
                if(nxt==n*n) return moves+1;
                vis[nxt]=true; q.offer(new int[]{nxt,moves+1});
            }
        }
    }
    return -1;
}`},
  {id:110,name:"Minimum Genetic Mutation",topic:"Graph BFS",difficulty:"Medium",pattern:"BFS Word Ladder",approach:"BFS; mutate each char to ACGT; add valid bank mutations to queue.",link:"https://leetcode.com/problems/minimum-genetic-mutation/",solution:`public int minMutation(String start, String end, String[] bank) {
    Set<String> set=new HashSet<>(Arrays.asList(bank));
    Queue<String> q=new LinkedList<>(); q.offer(start); int steps=0;
    while(!q.isEmpty()){
        for(int sz=q.size();sz>0;sz--){
            String cur=q.poll(); if(cur.equals(end)) return steps;
            char[] cs=cur.toCharArray();
            for(int i=0;i<cs.length;i++){
                char orig=cs[i];
                for(char c:new char[]{'A','C','G','T'}){
                    cs[i]=c; String next=new String(cs);
                    if(set.remove(next)) q.offer(next);
                }
                cs[i]=orig;
            }
        }
        steps++;
    }
    return -1;
}`},
  {id:111,name:"Word Ladder",topic:"Graph BFS",difficulty:"Hard",pattern:"BFS Word Ladder",approach:"BFS; change each char a-z; add valid dictionary words to queue.",link:"https://leetcode.com/problems/word-ladder/",solution:`public int ladderLength(String begin, String end, List<String> wordList) {
    Set<String> set=new HashSet<>(wordList);
    Queue<String> q=new LinkedList<>(); q.offer(begin); int steps=1;
    while(!q.isEmpty()){
        for(int sz=q.size();sz>0;sz--){
            char[] cs=q.poll().toCharArray();
            for(int i=0;i<cs.length;i++){
                char orig=cs[i];
                for(char c='a';c<='z';c++){
                    cs[i]=c; String next=new String(cs);
                    if(next.equals(end)) return steps+1;
                    if(set.remove(next)) q.offer(next);
                }
                cs[i]=orig;
            }
        }
        steps++;
    }
    return 0;
}`},
  {id:112,name:"Implement Trie (Prefix Tree)",topic:"Trie",difficulty:"Medium",pattern:"Trie",approach:"Node has 26 children and isEnd flag. insert/search/startsWith traverse nodes.",link:"https://leetcode.com/problems/implement-trie-prefix-tree/",solution:`class Trie {
    Trie[] ch=new Trie[26]; boolean end;
    public void insert(String s){Trie t=this;for(char c:s.toCharArray()){int i=c-'a';if(t.ch[i]==null)t.ch[i]=new Trie();t=t.ch[i];}t.end=true;}
    public boolean search(String s){Trie t=node(s);return t!=null&&t.end;}
    public boolean startsWith(String p){return node(p)!=null;}
    private Trie node(String s){Trie t=this;for(char c:s.toCharArray()){int i=c-'a';if(t.ch[i]==null)return null;t=t.ch[i];}return t;}
}`},
  {id:113,name:"Design Add and Search Words Data Structure",topic:"Trie",difficulty:"Medium",pattern:"Trie + DFS for Wildcard",approach:"Trie insert; for search, '.' triggers DFS on all 26 children.",link:"https://leetcode.com/problems/design-add-and-search-words-data-structure/",solution:`class WordDictionary {
    WordDictionary[] ch=new WordDictionary[26]; boolean end;
    public void addWord(String s){WordDictionary t=this;for(char c:s.toCharArray()){int i=c-'a';if(t.ch[i]==null)t.ch[i]=new WordDictionary();t=t.ch[i];}t.end=true;}
    public boolean search(String s){return dfs(s,0,this);}
    private boolean dfs(String s,int idx,WordDictionary node){
        if(idx==s.length()) return node.end;
        char c=s.charAt(idx);
        if(c=='.'){for(WordDictionary child:node.ch)if(child!=null&&dfs(s,idx+1,child))return true;return false;}
        int i=c-'a'; return node.ch[i]!=null&&dfs(s,idx+1,node.ch[i]);
    }
}`},
  {id:114,name:"Word Search II",topic:"Trie",difficulty:"Hard",pattern:"Trie + DFS Backtracking",approach:"Build trie of words; DFS from each cell following trie; collect words at end nodes.",link:"https://leetcode.com/problems/word-search-ii/",solution:`// Build Trie, then DFS from every cell
public List<String> findWords(char[][] board, String[] words) {
    Trie root=new Trie();
    for(String w:words){Trie t=root;for(char c:w.toCharArray()){int i=c-'a';if(t.ch[i]==null)t.ch[i]=new Trie();t=t.ch[i];}t.word=w;}
    List<String> res=new ArrayList<>();
    for(int i=0;i<board.length;i++) for(int j=0;j<board[0].length;j++) dfs(board,i,j,root,res);
    return res;
}
private void dfs(char[][] b,int i,int j,Trie node,List<String> res){
    if(i<0||i>=b.length||j<0||j>=b[0].length||b[i][j]=='#') return;
    char c=b[i][j]; Trie next=node.ch[c-'a'];
    if(next==null) return;
    if(next.word!=null){res.add(next.word);next.word=null;}
    b[i][j]='#'; dfs(b,i+1,j,next,res);dfs(b,i-1,j,next,res);dfs(b,i,j+1,next,res);dfs(b,i,j-1,next,res); b[i][j]=c;
}
class Trie{Trie[] ch=new Trie[26];String word;}`},
  {id:115,name:"Letter Combinations of a Phone Number",topic:"Backtracking",difficulty:"Medium",pattern:"Backtracking",approach:"Map digits to letters; backtrack adding one char per digit.",link:"https://leetcode.com/problems/letter-combinations-of-a-phone-number/",solution:`public List<String> letterCombinations(String digits) {
    List<String> res=new ArrayList<>();
    if(digits.isEmpty()) return res;
    String[] map={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    backtrack(digits,0,new StringBuilder(),res,map);
    return res;
}
private void backtrack(String d,int idx,StringBuilder cur,List<String> res,String[] map){
    if(idx==d.length()){res.add(cur.toString());return;}
    for(char c:map[d.charAt(idx)-'0'].toCharArray()){cur.append(c);backtrack(d,idx+1,cur,res,map);cur.deleteCharAt(cur.length()-1);}
}`},
  {id:116,name:"Combinations",topic:"Backtracking",difficulty:"Medium",pattern:"Backtracking",approach:"Choose k numbers from 1..n; increment start index to avoid duplicates.",link:"https://leetcode.com/problems/combinations/",solution:`public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> res=new ArrayList<>();
    backtrack(n,k,1,new ArrayList<>(),res); return res;
}
private void backtrack(int n,int k,int start,List<Integer> cur,List<List<Integer>> res){
    if(cur.size()==k){res.add(new ArrayList<>(cur));return;}
    for(int i=start;i<=n-(k-cur.size())+1;i++){cur.add(i);backtrack(n,k,i+1,cur,res);cur.remove(cur.size()-1);}
}`},
  {id:117,name:"Permutations",topic:"Backtracking",difficulty:"Medium",pattern:"Backtracking",approach:"Swap current index with all subsequent indices; recurse; swap back.",link:"https://leetcode.com/problems/permutations/",solution:`public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res=new ArrayList<>();
    backtrack(nums,0,res); return res;
}
private void backtrack(int[] nums,int start,List<List<Integer>> res){
    if(start==nums.length){List<Integer> l=new ArrayList<>();for(int n:nums)l.add(n);res.add(l);return;}
    for(int i=start;i<nums.length;i++){
        int t=nums[start];nums[start]=nums[i];nums[i]=t;
        backtrack(nums,start+1,res);
        t=nums[start];nums[start]=nums[i];nums[i]=t;
    }
}`},
  {id:118,name:"Combination Sum",topic:"Backtracking",difficulty:"Medium",pattern:"Backtracking",approach:"Same as Combination Sum-1 (#77).",link:"https://leetcode.com/problems/combination-sum/",solution:`public List<List<Integer>> combinationSum(int[] c, int target) {
    List<List<Integer>> res=new ArrayList<>();
    backtrack(c,0,target,new ArrayList<>(),res); return res;
}
private void backtrack(int[] c,int idx,int rem,List<Integer> cur,List<List<Integer>> res){
    if(rem==0){res.add(new ArrayList<>(cur));return;}
    for(int i=idx;i<c.length;i++){if(c[i]<=rem){cur.add(c[i]);backtrack(c,i,rem-c[i],cur,res);cur.remove(cur.size()-1);}}
}`},
  {id:119,name:"N-Queens II",topic:"Backtracking",difficulty:"Hard",pattern:"Backtracking + Constraint Propagation",approach:"Track columns and diagonals as sets; place queens row by row.",link:"https://leetcode.com/problems/n-queens-ii/",solution:`int cnt=0;
public int totalNQueens(int n) {
    backtrack(n,0,new HashSet<>(),new HashSet<>(),new HashSet<>());
    return cnt;
}
private void backtrack(int n,int row,Set<Integer> cols,Set<Integer> d1,Set<Integer> d2){
    if(row==n){cnt++;return;}
    for(int col=0;col<n;col++){
        if(cols.contains(col)||d1.contains(row-col)||d2.contains(row+col)) continue;
        cols.add(col);d1.add(row-col);d2.add(row+col);
        backtrack(n,row+1,cols,d1,d2);
        cols.remove(col);d1.remove(row-col);d2.remove(row+col);
    }
}`},
  {id:120,name:"Generate Parentheses",topic:"Backtracking",difficulty:"Medium",pattern:"Backtracking",approach:"Add '(' if open < n; add ')' if close < open.",link:"https://leetcode.com/problems/generate-parentheses/",solution:`public List<String> generateParenthesis(int n) {
    List<String> res=new ArrayList<>();
    backtrack(n,0,0,new StringBuilder(),res); return res;
}
private void backtrack(int n,int open,int close,StringBuilder cur,List<String> res){
    if(cur.length()==2*n){res.add(cur.toString());return;}
    if(open<n){cur.append('(');backtrack(n,open+1,close,cur,res);cur.deleteCharAt(cur.length()-1);}
    if(close<open){cur.append(')');backtrack(n,open,close+1,cur,res);cur.deleteCharAt(cur.length()-1);}
}`},
  {id:121,name:"Word Search",topic:"Backtracking",difficulty:"Medium",pattern:"DFS + Backtracking",approach:"DFS from each cell; mark visited, recurse on 4 neighbors, unmark on return.",link:"https://leetcode.com/problems/word-search/",solution:`public boolean exist(char[][] board, String word) {
    for(int i=0;i<board.length;i++) for(int j=0;j<board[0].length;j++)
        if(dfs(board,word,i,j,0)) return true;
    return false;
}
private boolean dfs(char[][] b,String w,int i,int j,int idx){
    if(idx==w.length()) return true;
    if(i<0||i>=b.length||j<0||j>=b[0].length||b[i][j]!=w.charAt(idx)) return false;
    char t=b[i][j]; b[i][j]='#';
    boolean res=dfs(b,w,i+1,j,idx+1)||dfs(b,w,i-1,j,idx+1)||dfs(b,w,i,j+1,idx+1)||dfs(b,w,i,j-1,idx+1);
    b[i][j]=t; return res;
}`},
  {id:122,name:"Convert Sorted Array to Binary Search Tree",topic:"Divide & Conquer",difficulty:"Easy",pattern:"Divide & Conquer",approach:"Middle element is root; recurse on left and right halves.",link:"https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",solution:`public TreeNode sortedArrayToBST(int[] nums) {
    return build(nums,0,nums.length-1);
}
private TreeNode build(int[] nums,int l,int r){
    if(l>r) return null;
    int mid=(l+r)/2;
    TreeNode root=new TreeNode(nums[mid]);
    root.left=build(nums,l,mid-1);
    root.right=build(nums,mid+1,r);
    return root;
}`},
  {id:123,name:"Sort List",topic:"Divide & Conquer",difficulty:"Medium",pattern:"Merge Sort on LinkedList",approach:"Find middle with slow/fast pointers; split; merge sort both halves.",link:"https://leetcode.com/problems/sort-list/",solution:`public ListNode sortList(ListNode head) {
    if(head==null||head.next==null) return head;
    ListNode mid=getMid(head),right=mid.next; mid.next=null;
    return merge(sortList(head),sortList(right));
}
private ListNode getMid(ListNode h){ListNode s=h,f=h.next;while(f!=null&&f.next!=null){s=s.next;f=f.next.next;}return s;}
private ListNode merge(ListNode a,ListNode b){
    ListNode d=new ListNode(0),c=d;
    while(a!=null&&b!=null){if(a.val<=b.val){c.next=a;a=a.next;}else{c.next=b;b=b.next;}c=c.next;}
    c.next=a!=null?a:b; return d.next;
}`},
  {id:124,name:"Construct Quad Tree",topic:"Divide & Conquer",difficulty:"Medium",pattern:"Divide & Conquer",approach:"Check if all values in region are same; if yes, leaf node. Else divide into 4.",link:"https://leetcode.com/problems/construct-quad-tree/",solution:`public Node construct(int[][] grid) { return build(grid,0,0,grid.length); }
private Node build(int[][] g,int r,int c,int len){
    if(allSame(g,r,c,len)) return new Node(g[r][c]==1,true);
    int half=len/2;
    return new Node(false,false,build(g,r,c,half),build(g,r,c+half,half),build(g,r+half,c,half),build(g,r+half,c+half,half));
}
private boolean allSame(int[][] g,int r,int c,int len){
    int v=g[r][c];
    for(int i=r;i<r+len;i++) for(int j=c;j<c+len;j++) if(g[i][j]!=v) return false;
    return true;
}`},
  {id:125,name:"Merge k Sorted Lists",topic:"Divide & Conquer",difficulty:"Hard",pattern:"Divide & Conquer / MinHeap",approach:"Use a MinPriorityQueue; always extract smallest head and add its next.",link:"https://leetcode.com/problems/merge-k-sorted-lists/",solution:`public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq=new PriorityQueue<>((a,b)->a.val-b.val);
    for(ListNode l:lists) if(l!=null) pq.offer(l);
    ListNode dummy=new ListNode(0),cur=dummy;
    while(!pq.isEmpty()){
        ListNode n=pq.poll(); cur.next=n; cur=cur.next;
        if(n.next!=null) pq.offer(n.next);
    }
    return dummy.next;
}`},
  {id:126,name:"Maximum Subarray",topic:"Kadane's Algorithm",difficulty:"Medium",pattern:"Kadane's Algorithm",approach:"Keep running sum; reset to 0 if negative. Track max.",link:"https://leetcode.com/problems/maximum-subarray/",solution:`public int maxSubArray(int[] nums) {
    int max=nums[0],cur=nums[0];
    for(int i=1;i<nums.length;i++){cur=Math.max(nums[i],cur+nums[i]);max=Math.max(max,cur);}
    return max;
}`},
  {id:127,name:"Maximum Sum Circular Subarray",topic:"Kadane's Algorithm",difficulty:"Medium",pattern:"Kadane's + Total Sum",approach:"Max of (normal max subarray) and (total - min subarray). Handle all-negative edge case.",link:"https://leetcode.com/problems/maximum-sum-circular-subarray/",solution:`public int maxSubarraySumCircular(int[] nums) {
    int maxSum=nums[0],minSum=nums[0],curMax=nums[0],curMin=nums[0],total=nums[0];
    for(int i=1;i<nums.length;i++){
        curMax=Math.max(nums[i],curMax+nums[i]); maxSum=Math.max(maxSum,curMax);
        curMin=Math.min(nums[i],curMin+nums[i]); minSum=Math.min(minSum,curMin);
        total+=nums[i];
    }
    return maxSum>0?Math.max(maxSum,total-minSum):maxSum;
}`},
  {id:128,name:"Search Insert Position",topic:"Binary Search",difficulty:"Easy",pattern:"Binary Search",approach:"Standard binary search; return left when not found (insertion point).",link:"https://leetcode.com/problems/search-insert-position/",solution:`public int searchInsert(int[] nums, int target) {
    int l=0,r=nums.length;
    while(l<r){int m=l+(r-l)/2;if(nums[m]<target)l=m+1;else r=m;}
    return l;
}`},
  {id:129,name:"Search a 2D Matrix",topic:"Binary Search",difficulty:"Medium",pattern:"Binary Search on Flattened Matrix",approach:"Treat matrix as sorted 1D array; index row=mid/n, col=mid%n.",link:"https://leetcode.com/problems/search-a-2d-matrix/",solution:`public boolean searchMatrix(int[][] m, int target) {
    int r=m.length,c=m[0].length,l=0,hi=r*c-1;
    while(l<=hi){int mid=l+(hi-l)/2,v=m[mid/c][mid%c];if(v==target)return true;else if(v<target)l=mid+1;else hi=mid-1;}
    return false;
}`},
  {id:130,name:"Find Peak Element",topic:"Binary Search",difficulty:"Medium",pattern:"Binary Search",approach:"Move to side with larger neighbor; peak guaranteed to exist.",link:"https://leetcode.com/problems/find-peak-element/",solution:`public int findPeakElement(int[] nums) {
    int l=0,r=nums.length-1;
    while(l<r){int m=l+(r-l)/2;if(nums[m]<nums[m+1])l=m+1;else r=m;}
    return l;
}`},
  {id:131,name:"Search in Rotated Sorted Array",topic:"Binary Search",difficulty:"Medium",pattern:"Binary Search",approach:"Determine which half is sorted; check if target lies in sorted half.",link:"https://leetcode.com/problems/search-in-rotated-sorted-array/",solution:`public int search(int[] nums, int target) {
    int l=0,r=nums.length-1;
    while(l<=r){
        int m=l+(r-l)/2;
        if(nums[m]==target) return m;
        if(nums[l]<=nums[m]){if(target>=nums[l]&&target<nums[m])r=m-1;else l=m+1;}
        else{if(target>nums[m]&&target<=nums[r])l=m+1;else r=m-1;}
    }
    return -1;
}`},
  {id:132,name:"Find First and Last Position of Element in Sorted Array",topic:"Binary Search",difficulty:"Medium",pattern:"Binary Search (Lower/Upper Bound)",approach:"Two binary searches: one for left bound, one for right bound.",link:"https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",solution:`public int[] searchRange(int[] nums, int target) {
    return new int[]{lower(nums,target),upper(nums,target)};
}
private int lower(int[] n,int t){int l=0,r=n.length;while(l<r){int m=l+(r-l)/2;if(n[m]<t)l=m+1;else r=m;}return l<n.length&&n[l]==t?l:-1;}
private int upper(int[] n,int t){int l=0,r=n.length;while(l<r){int m=l+(r-l)/2;if(n[m]<=t)l=m+1;else r=m;}return l>0&&n[l-1]==t?l-1:-1;}`},
  {id:133,name:"Find Minimum in Rotated Sorted Array",topic:"Binary Search",difficulty:"Medium",pattern:"Binary Search",approach:"If mid > right, min is in right half; else left half.",link:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",solution:`public int findMin(int[] nums) {
    int l=0,r=nums.length-1;
    while(l<r){int m=l+(r-l)/2;if(nums[m]>nums[r])l=m+1;else r=m;}
    return nums[l];
}`},
  {id:134,name:"Median of Two Sorted Arrays",topic:"Binary Search",difficulty:"Hard",pattern:"Binary Search on Partition",approach:"Binary search on smaller array; partition both so left halves have (m+n)/2 elements.",link:"https://leetcode.com/problems/median-of-two-sorted-arrays/",solution:`public double findMedianSortedArrays(int[] A, int[] B) {
    if(A.length>B.length) return findMedianSortedArrays(B,A);
    int m=A.length,n=B.length,lo=0,hi=m;
    while(lo<=hi){
        int i=lo+(hi-lo)/2,j=(m+n+1)/2-i;
        int maxL1=i==0?Integer.MIN_VALUE:A[i-1],minR1=i==m?Integer.MAX_VALUE:A[i];
        int maxL2=j==0?Integer.MIN_VALUE:B[j-1],minR2=j==n?Integer.MAX_VALUE:B[j];
        if(maxL1<=minR2&&maxL2<=minR1){
            if((m+n)%2==0) return(Math.max(maxL1,maxL2)+Math.min(minR1,minR2))/2.0;
            else return Math.max(maxL1,maxL2);
        } else if(maxL1>minR2) hi=i-1; else lo=i+1;
    }
    return 0;
}`},
  {id:135,name:"Kth Largest Element in an Array",topic:"Heap",difficulty:"Medium",pattern:"MinHeap of size K",approach:"Maintain min-heap of size k; root is kth largest.",link:"https://leetcode.com/problems/kth-largest-element-in-an-array/",solution:`public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq=new PriorityQueue<>();
    for(int n:nums){pq.offer(n);if(pq.size()>k)pq.poll();}
    return pq.peek();
}`},
  {id:136,name:"IPO",topic:"Heap",difficulty:"Hard",pattern:"Greedy + Two Heaps",approach:"Sort by capital; unlock projects affordable now (minHeap by capital); greedily pick max profit (maxHeap).",link:"https://leetcode.com/problems/ipo/",solution:`public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n=profits.length;
    int[][] projects=new int[n][2];
    for(int i=0;i<n;i++) projects[i]=new int[]{capital[i],profits[i]};
    Arrays.sort(projects,(a,b)->a[0]-b[0]);
    PriorityQueue<Integer> maxH=new PriorityQueue<>(Collections.reverseOrder());
    int idx=0;
    for(int i=0;i<k;i++){
        while(idx<n&&projects[idx][0]<=w) maxH.offer(projects[idx++][1]);
        if(maxH.isEmpty()) break;
        w+=maxH.poll();
    }
    return w;
}`},
  {id:137,name:"Find K Pairs with Smallest Sums",topic:"Heap",difficulty:"Medium",pattern:"MinHeap",approach:"Start with (0,0); push (i,j+1) and (i+1,0) when (i,j) is popped.",link:"https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",solution:`public List<int[]> kSmallestPairs(int[] n1, int[] n2, int k) {
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->(n1[a[0]]+n2[a[1]])-(n1[b[0]]+n2[b[1]]));
    pq.offer(new int[]{0,0});
    List<int[]> res=new ArrayList<>();
    while(!pq.isEmpty()&&res.size()<k){
        int[] cur=pq.poll(); res.add(new int[]{n1[cur[0]],n2[cur[1]]});
        if(cur[1]+1<n2.length) pq.offer(new int[]{cur[0],cur[1]+1});
        if(cur[1]==0&&cur[0]+1<n1.length) pq.offer(new int[]{cur[0]+1,0});
    }
    return res;
}`},
  {id:138,name:"Find Median from Data Stream",topic:"Heap",difficulty:"Hard",pattern:"Two Heaps (MaxHeap + MinHeap)",approach:"MaxHeap for lower half, MinHeap for upper half. Balance sizes after each add.",link:"https://leetcode.com/problems/find-median-from-data-stream/",solution:`class MedianFinder {
    PriorityQueue<Integer> lo=new PriorityQueue<>(Collections.reverseOrder()), hi=new PriorityQueue<>();
    public void addNum(int num) {
        lo.offer(num); hi.offer(lo.poll());
        if(lo.size()<hi.size()) lo.offer(hi.poll());
    }
    public double findMedian() {
        return lo.size()>hi.size()?lo.peek():(lo.peek()+hi.peek())/2.0;
    }
}`},
  {id:139,name:"Add Binary",topic:"Bit Manipulation",difficulty:"Easy",pattern:"Simulation / Bit Ops",approach:"Process from end; carry propagation.",link:"https://leetcode.com/problems/add-binary/",solution:`public String addBinary(String a, String b) {
    StringBuilder sb=new StringBuilder(); int i=a.length()-1,j=b.length()-1,carry=0;
    while(i>=0||j>=0||carry>0){
        int s=(i>=0?a.charAt(i--)-'0':0)+(j>=0?b.charAt(j--)-'0':0)+carry;
        carry=s/2; sb.append(s%2);
    }
    return sb.reverse().toString();
}`},
  {id:140,name:"Reverse Bits",topic:"Bit Manipulation",difficulty:"Easy",pattern:"Bit Manipulation",approach:"For each of 32 bits, shift result left and OR with current LSB.",link:"https://leetcode.com/problems/reverse-bits/",solution:`public int reverseBits(int n) {
    int res=0;
    for(int i=0;i<32;i++){res=(res<<1)|(n&1);n>>=1;}
    return res;
}`},
  {id:141,name:"Number of 1 Bits",topic:"Bit Manipulation",difficulty:"Easy",pattern:"Bit Manipulation",approach:"n & (n-1) clears the lowest set bit. Count iterations.",link:"https://leetcode.com/problems/number-of-1-bits/",solution:`public int hammingWeight(int n) {
    int cnt=0;
    while(n!=0){n&=(n-1);cnt++;}
    return cnt;
}`},
  {id:142,name:"Single Number",topic:"Bit Manipulation",difficulty:"Easy",pattern:"XOR",approach:"XOR all numbers; duplicates cancel out, leaving the single number.",link:"https://leetcode.com/problems/single-number/",solution:`public int singleNumber(int[] nums) {
    int res=0;
    for(int n:nums) res^=n;
    return res;
}`},
  {id:143,name:"Single Number II",topic:"Bit Manipulation",difficulty:"Medium",pattern:"Bit Counting",approach:"For each bit, count 1s mod 3; remaining 1s form the answer.",link:"https://leetcode.com/problems/single-number-ii/",solution:`public int singleNumber(int[] nums) {
    int ones=0,twos=0;
    for(int n:nums){ones=(ones^n)&~twos;twos=(twos^n)&~ones;}
    return ones;
}`},
  {id:144,name:"Bitwise AND of Numbers Range",topic:"Bit Manipulation",difficulty:"Medium",pattern:"Common Prefix",approach:"Find common bit prefix of left and right by right-shifting until equal.",link:"https://leetcode.com/problems/bitwise-and-of-numbers-range/",solution:`public int rangeBitwiseAnd(int left, int right) {
    int shift=0;
    while(left!=right){left>>=1;right>>=1;shift++;}
    return left<<shift;
}`},
  {id:145,name:"Palindrome Number",topic:"Math",difficulty:"Easy",pattern:"Math",approach:"Negative or trailing zero → false. Reverse second half; compare.",link:"https://leetcode.com/problems/palindrome-number/",solution:`public boolean isPalindrome(int x) {
    if(x<0||(x%10==0&&x!=0)) return false;
    int rev=0;
    while(x>rev){rev=rev*10+x%10;x/=10;}
    return x==rev||x==rev/10;
}`},
  {id:146,name:"Plus One",topic:"Math",difficulty:"Easy",pattern:"Simulation",approach:"Add one from end; handle carry; if all 9s, prepend 1.",link:"https://leetcode.com/problems/plus-one/",solution:`public int[] plusOne(int[] digits) {
    for(int i=digits.length-1;i>=0;i--){
        if(digits[i]<9){digits[i]++;return digits;}
        digits[i]=0;
    }
    int[] res=new int[digits.length+1]; res[0]=1; return res;
}`},
  {id:147,name:"Factorial Trailing Zeroes",topic:"Math",difficulty:"Medium",pattern:"Math",approach:"Count factors of 5 (each 5 contributes one trailing zero).",link:"https://leetcode.com/problems/factorial-trailing-zeroes/",solution:`public int trailingZeroes(int n) {
    int cnt=0;
    while(n>=5){n/=5;cnt+=n;}
    return cnt;
}`},
  {id:148,name:"Sqrt(x)",topic:"Math",difficulty:"Easy",pattern:"Binary Search",approach:"Binary search on [0, x]; find largest m where m*m <= x.",link:"https://leetcode.com/problems/sqrtx/",solution:`public int mySqrt(int x) {
    long l=0,r=x;
    while(l<r){long m=l+(r-l+1)/2;if(m*m<=x)l=m;else r=m-1;}
    return (int)l;
}`},
  {id:149,name:"Pow(x, n)",topic:"Math",difficulty:"Medium",pattern:"Fast Exponentiation",approach:"Divide n by 2 each step; square x. Handle negative n.",link:"https://leetcode.com/problems/powx-n/",solution:`public double myPow(double x, int n) {
    long N=n; if(N<0){x=1/x;N=-N;}
    double res=1;
    while(N>0){if((N&1)==1)res*=x;x*=x;N>>=1;}
    return res;
}`},
  {id:150,name:"Max Points on a Line",topic:"Math",difficulty:"Hard",pattern:"HashMap + GCD",approach:"For each point, map slope (as reduced fraction) to count. Max + 1 = points on line.",link:"https://leetcode.com/problems/max-points-on-a-line/",solution:`public int maxPoints(int[][] points) {
    int n=points.length,res=1;
    for(int i=0;i<n;i++){
        Map<String,Integer> map=new HashMap<>();
        for(int j=i+1;j<n;j++){
            int dy=points[j][1]-points[i][1],dx=points[j][0]-points[i][0];
            int g=gcd(Math.abs(dy),Math.abs(dx));
            if(g!=0){dy/=g;dx/=g;}
            if(dx<0){dy=-dy;dx=-dx;} else if(dx==0) dy=Math.abs(dy);
            String key=dy+"/"+dx;
            map.merge(key,1,Integer::sum);
            res=Math.max(res,map.get(key)+1);
        }
    }
    return res;
}
private int gcd(int a,int b){return b==0?a:gcd(b,a%b);}`},
  {id:151,name:"Climbing Stairs",topic:"1D DP",difficulty:"Easy",pattern:"DP (Fibonacci)",approach:"dp[i] = dp[i-1] + dp[i-2]. Base: dp[1]=1, dp[2]=2.",link:"https://leetcode.com/problems/climbing-stairs/",solution:`public int climbStairs(int n) {
    if(n<=2) return n;
    int a=1,b=2;
    for(int i=3;i<=n;i++){int c=a+b;a=b;b=c;}
    return b;
}`},
  {id:152,name:"House Robber",topic:"1D DP",difficulty:"Medium",pattern:"DP",approach:"dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",link:"https://leetcode.com/problems/house-robber/",solution:`public int rob(int[] nums) {
    int prev2=0,prev1=0;
    for(int n:nums){int cur=Math.max(prev1,prev2+n);prev2=prev1;prev1=cur;}
    return prev1;
}`},
  {id:153,name:"Word Break",topic:"1D DP",difficulty:"Medium",pattern:"DP + Trie",approach:"dp[i] = true if any dp[j] && word(j..i) in dictionary.",link:"https://leetcode.com/problems/word-break/",solution:`public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> set=new HashSet<>(wordDict);
    boolean[] dp=new boolean[s.length()+1]; dp[0]=true;
    for(int i=1;i<=s.length();i++)
        for(int j=0;j<i;j++)
            if(dp[j]&&set.contains(s.substring(j,i))){dp[i]=true;break;}
    return dp[s.length()];
}`},
  {id:154,name:"Coin Change",topic:"1D DP",difficulty:"Medium",pattern:"Unbounded Knapsack DP",approach:"dp[amount] = min coins; dp[i] = min(dp[i], dp[i-coin]+1).",link:"https://leetcode.com/problems/coin-change/",solution:`public int coinChange(int[] coins, int amount) {
    int[] dp=new int[amount+1]; Arrays.fill(dp,amount+1); dp[0]=0;
    for(int i=1;i<=amount;i++) for(int c:coins) if(c<=i) dp[i]=Math.min(dp[i],dp[i-c]+1);
    return dp[amount]>amount?-1:dp[amount];
}`},
  {id:155,name:"Longest Increasing Subsequence",topic:"1D DP",difficulty:"Medium",pattern:"DP / Binary Search (Patience Sort)",approach:"Maintain tails array; binary search for position to place each element. O(n log n).",link:"https://leetcode.com/problems/longest-increasing-subsequence/",solution:`public int lengthOfLIS(int[] nums) {
    List<Integer> tails=new ArrayList<>();
    for(int n:nums){
        int lo=0,hi=tails.size();
        while(lo<hi){int m=lo+(hi-lo)/2;if(tails.get(m)<n)lo=m+1;else hi=m;}
        if(lo==tails.size()) tails.add(n); else tails.set(lo,n);
    }
    return tails.size();
}`},
  {id:156,name:"Triangle",topic:"Multidimensional DP",difficulty:"Medium",pattern:"DP (Bottom-up)",approach:"Start from bottom row; dp[j] = min(dp[j], dp[j+1]) + triangle[i][j].",link:"https://leetcode.com/problems/triangle/",solution:`public int minimumTotal(List<List<Integer>> t) {
    int n=t.size(); int[] dp=new int[n+1];
    for(int i=n-1;i>=0;i--) for(int j=0;j<=i;j++) dp[j]=Math.min(dp[j],dp[j+1])+t.get(i).get(j);
    return dp[0];
}`},
  {id:157,name:"Minimum Path Sum",topic:"Multidimensional DP",difficulty:"Medium",pattern:"2D DP",approach:"dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j].",link:"https://leetcode.com/problems/minimum-path-sum/",solution:`public int minPathSum(int[][] grid) {
    int m=grid.length,n=grid[0].length;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(i==0&&j==0) continue;
        int up=i>0?grid[i-1][j]:Integer.MAX_VALUE;
        int left=j>0?grid[i][j-1]:Integer.MAX_VALUE;
        grid[i][j]+=Math.min(up,left);
    }
    return grid[m-1][n-1];
}`},
  {id:158,name:"Unique Paths II",topic:"Multidimensional DP",difficulty:"Medium",pattern:"2D DP",approach:"If obstacle, dp=0. Else dp[i][j] = dp[i-1][j]+dp[i][j-1].",link:"https://leetcode.com/problems/unique-paths-ii/",solution:`public int uniquePathsWithObstacles(int[][] g) {
    int m=g.length,n=g[0].length; int[] dp=new int[n]; dp[0]=g[0][0]==0?1:0;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(g[i][j]==1){dp[j]=0;continue;}
        if(j>0) dp[j]+=dp[j-1];
    }
    return dp[n-1];
}`},
  {id:159,name:"Longest Palindromic Substring",topic:"Multidimensional DP",difficulty:"Medium",pattern:"Expand Around Center",approach:"Expand around each center (odd/even); track max length.",link:"https://leetcode.com/problems/longest-palindromic-substring/",solution:`public String longestPalindrome(String s) {
    int start=0,len=1;
    for(int i=0;i<s.length();i++){
        int l1=expand(s,i,i),l2=expand(s,i,i+1);
        int l=Math.max(l1,l2);
        if(l>len){len=l;start=i-(l-1)/2;}
    }
    return s.substring(start,start+len);
}
private int expand(String s,int l,int r){while(l>=0&&r<s.length()&&s.charAt(l)==s.charAt(r)){l--;r++;}return r-l-1;}`},
  {id:160,name:"Interleaving String",topic:"Multidimensional DP",difficulty:"Medium",pattern:"2D DP",approach:"dp[i][j] = can form s3[0..i+j] from s1[0..i] and s2[0..j].",link:"https://leetcode.com/problems/interleaving-string/",solution:`public boolean isInterleave(String s1, String s2, String s3) {
    int m=s1.length(),n=s2.length();
    if(m+n!=s3.length()) return false;
    boolean[] dp=new boolean[n+1]; dp[0]=true;
    for(int j=1;j<=n;j++) dp[j]=dp[j-1]&&s2.charAt(j-1)==s3.charAt(j-1);
    for(int i=1;i<=m;i++){
        dp[0]=dp[0]&&s1.charAt(i-1)==s3.charAt(i-1);
        for(int j=1;j<=n;j++)
            dp[j]=(dp[j]&&s1.charAt(i-1)==s3.charAt(i+j-1))||(dp[j-1]&&s2.charAt(j-1)==s3.charAt(i+j-1));
    }
    return dp[n];
}`},
  {id:161,name:"Edit Distance",topic:"Multidimensional DP",difficulty:"Medium",pattern:"2D DP",approach:"dp[i][j] = min edits to convert word1[0..i] to word2[0..j].",link:"https://leetcode.com/problems/edit-distance/",solution:`public int minDistance(String w1, String w2) {
    int m=w1.length(),n=w2.length(); int[] dp=new int[n+1];
    for(int j=0;j<=n;j++) dp[j]=j;
    for(int i=1;i<=m;i++){
        int prev=dp[0]; dp[0]=i;
        for(int j=1;j<=n;j++){int t=dp[j];dp[j]=w1.charAt(i-1)==w2.charAt(j-1)?prev:1+Math.min(prev,Math.min(dp[j],dp[j-1]));prev=t;}
    }
    return dp[n];
}`},
  {id:162,name:"Best Time to Buy and Sell Stock III",topic:"Multidimensional DP",difficulty:"Hard",pattern:"State Machine DP",approach:"Track 4 states: buy1, sell1, buy2, sell2.",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",solution:`public int maxProfit(int[] prices) {
    int b1=Integer.MIN_VALUE,s1=0,b2=Integer.MIN_VALUE,s2=0;
    for(int p:prices){b1=Math.max(b1,-p);s1=Math.max(s1,b1+p);b2=Math.max(b2,s1-p);s2=Math.max(s2,b2+p);}
    return s2;
}`},
  {id:163,name:"Best Time to Buy and Sell Stock IV",topic:"Multidimensional DP",difficulty:"Hard",pattern:"State Machine DP",approach:"Track buy[k] and sell[k] for k transactions. Generalize III.",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",solution:`public int maxProfit(int k, int[] prices) {
    int[] buy=new int[k],sell=new int[k];
    Arrays.fill(buy,Integer.MIN_VALUE);
    for(int p:prices)
        for(int i=k-1;i>=0;i--){
            sell[i]=Math.max(sell[i],buy[i]+p);
            buy[i]=Math.max(buy[i],(i>0?sell[i-1]:0)-p);
        }
    return sell[k-1];
}`},
  {id:164,name:"Maximal Square",topic:"Multidimensional DP",difficulty:"Medium",pattern:"2D DP",approach:"dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 if matrix[i][j]='1'.",link:"https://leetcode.com/problems/maximal-square/",solution:`public int maximalSquare(char[][] m) {
    int max=0,prev=0; int[] dp=new int[m[0].length+1];
    for(int i=1;i<=m.length;i++) for(int j=1;j<=m[0].length;j++){
        int t=dp[j];
        dp[j]=m[i-1][j-1]=='1'?Math.min(dp[j],Math.min(dp[j-1],prev))+1:0;
        max=Math.max(max,dp[j]); prev=t;
    }
    return max*max;
}`},
];

const TOPICS = ["All", ...Array.from(new Set(problems.map(p => p.topic)))];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const STATUSES = ["All", "Todo", "In Progress", "Done"];
const PATTERNS = ["All", ...Array.from(new Set(problems.map(p => p.pattern))).sort()];

const diffColor = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
const statusColor = { "Todo": "#6b7280", "In Progress": "#3b82f6", "Done": "#22c55e" };
const statusBg = { "Todo": "#f3f4f6", "In Progress": "#eff6ff", "Done": "#f0fdf4" };

const STORAGE_KEY = "dsa_tracker_status";

function loadStatus() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? JSON.parse(r) : {};
  } catch { return {}; }
}
function saveStatus(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export default function App() {
  const { currentUser, logout } = useAuth();
  const { statuses, stats, updateStatus, loading } = useProgress();
  
  // const [statuses, setStatuses] = useState(loadStatus);
  const [filters, setFilters] = useState({ topic: "All", difficulty: "All", status: "All", pattern: "All", search: "" });
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("solution");
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("dsa_dark_mode");
    return saved ? JSON.parse(saved) : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("dsa_dark_mode", JSON.stringify(next));
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  useEffect(() => {
  document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
}, []);

  // const updateStatus = (id, val) => {
  //   const next = { ...statuses, [id]: val };
  //   setStatuses(next);
  //   saveStatus(next);
  // };

  // const stats = useMemo(() => {
  //   const done = problems.filter(p => statuses[p.id] === "Done").length;
  //   const inProgress = problems.filter(p => statuses[p.id] === "In Progress").length;
  //   const easy = problems.filter(p => p.difficulty === "Easy" && statuses[p.id] === "Done").length;
  //   const medium = problems.filter(p => p.difficulty === "Medium" && statuses[p.id] === "Done").length;
  //   const hard = problems.filter(p => p.difficulty === "Hard" && statuses[p.id] === "Done").length;
  //   return { done, inProgress, easy, medium, hard, total: problems.length };
  // }, [statuses]);

  const filtered = useMemo(() => problems.filter(p => {
    const f = filters;
    const st = statuses[p.id] || "Todo";
    if (f.topic !== "All" && p.topic !== f.topic) return false;
    if (f.difficulty !== "All" && p.difficulty !== f.difficulty) return false;
    if (f.status !== "All" && st !== f.status) return false;
    if (f.pattern !== "All" && p.pattern !== f.pattern) return false;
    if (f.search && !p.name.toLowerCase().includes(f.search.toLowerCase())) return false;
    return true;
  }), [filters, statuses]);

  const pct = Math.round((stats.done / stats.total) * 100);

  const sel = selected ? problems.find(p => p.id === selected) : null;

  // Update the header to show logout button
  if (!currentUser) {
    return <Login />;
  }
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>Loading...</div>;
  }

  return (
    <>
      {/* Fixed Header */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        background: 'var(--color-background-secondary)', 
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          maxWidth: 900, 
          margin: '0 auto', 
          padding: '1rem 0.5rem',
          fontFamily: "var(--font-sans)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>DSA Problem Tracker</h2>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
                Welcome, {currentUser.displayName || currentUser.email} • 164 LeetCode problems
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleDarkMode}
                style={{ fontSize: 20, padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", transition: "all .2s" }}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button onClick={logout}
                style={{ fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", transition: "all .2s" }}>
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginTop: 16 }}>
            {[
              { label: "Total", value: stats.total, color: "var(--color-text-primary)" },
              { label: "Done", value: stats.done, color: "#22c55e" },
              { label: "In Progress", value: stats.inProgress, color: "#3b82f6" },
              { label: "Easy done", value: stats.easyDone, color: "#22c55e" },
              { label: "Medium done", value: stats.mediumDone, color: "#f59e0b" },
              { label: "Hard done", value: stats.hardDone, color: "#ef4444" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 500, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px", marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Overall progress</span>
              <span style={{ fontWeight: 500 }}>{pct}%</span>
            </div>
            <div style={{ background: "var(--color-border-tertiary)", borderRadius: 99, height: 8 }}>
              <div style={{ width: pct + "%", background: "#22c55e", borderRadius: 99, height: 8, transition: "width .4s" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", maxWidth: 900,        margin: "0 auto", padding: "1rem 0.5rem" }}>
        
        {/* Search and Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <input placeholder="Search problems..." value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{ flex: 1, minWidth: 160, fontSize: 13, padding: "6px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
          <button onClick={() => setShowFilters(v => !v)}
            style={{ fontSize: 13, padding: "6px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: showFilters ? "var(--color-background-info)" : "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer" }}>
            Filters {showFilters ? "▲" : "▼"}
          </button>
          <button onClick={() => setFilters({ topic: "All", difficulty: "All", status: "All", pattern: "All", search: "" })}
            style={{ fontSize: 13, padding: "6px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", cursor: "pointer" }}>
            Reset
          </button>
        </div>

        {showFilters && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8, marginBottom: 12 }}>
            {[
              { label: "Topic", key: "topic", opts: TOPICS },
              { label: "Difficulty", key: "difficulty", opts: DIFFICULTIES },
              { label: "Status", key: "status", opts: STATUSES },
              { label: "Pattern", key: "pattern", opts: PATTERNS },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>{f.label}</div>
                <select value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", fontSize: 13, padding: "5px 8px", borderRadius: 7, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>{filtered.length} problems</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map(p => {
            const st = statuses[p.id] || "Todo";
            return (
              <div key={p.id} onClick={() => { setSelected(p.id === selected ? null : p.id); setTab("solution"); }}
                style={{ background: "var(--color-background-primary)", border: `0.5px solid ${p.id === selected ? "#3b82f6" : "var(--color-border-tertiary)"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", transition: "border-color .15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", minWidth: 24 }}>#{p.id}</span>
                  <span style={{ fontWeight: 500, fontSize: 14, flex: 1, minWidth: 120 }}>{p.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: diffColor[p.difficulty] }}>{p.difficulty}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderRadius: 6, padding: "2px 8px" }}>{p.pattern}</span>
                  <select value={st}
                    onClick={e => e.stopPropagation()}
                    onChange={e => { e.stopPropagation(); updateStatus(p.id, e.target.value); }}
                    style={{ fontSize: 11, padding: "3px 6px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: statusBg[st], color: statusColor[st], cursor: "pointer", fontWeight: 500 }}>
                    {["Todo", "In Progress", "Done"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize: 11, color: "#3b82f6", textDecoration: "none", padding: "3px 8px", border: "0.5px solid #3b82f6", borderRadius: 6 }}>
                    LC →
                  </a>
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>
                  <span style={{ marginRight: 8 }}>{p.topic}</span>
                </div>

                {p.id === selected && (
                  <div style={{ marginTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12 }}
                    onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      {["solution", "approach"].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                          style={{ fontSize: 12, padding: "4px 12px", borderRadius: 7, border: "0.5px solid var(--color-border-secondary)", background: tab === t ? "#3b82f6" : "var(--color-background-secondary)", color: tab === t ? "#fff" : "var(--color-text-primary)", cursor: "pointer", fontWeight: tab === t ? 500 : 400 }}>
                          {t === "solution" ? "Java Solution" : "Approach & Pattern"}
                        </button>
                      ))}
                    </div>
                    {tab === "solution" ? (
                      <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.6, background: "var(--color-background-secondary)", borderRadius: 8, padding: 14, overflowX: "auto", fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {p.solution}
                      </pre>
                    ) : (
                      <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Pattern</span>
                          <div style={{ marginTop: 3 }}>
                            <span style={{ background: "#eff6ff", color: "#1d4ed8", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 500 }}>{p.pattern}</span>
                          </div>
                        </div>
                        <div>
                          <span style={{ fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Approach</span>
                          <div style={{ marginTop: 4, color: "var(--color-text-primary)", fontSize: 13 }}>{p.approach}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--color-text-secondary)", fontSize: 14 }}>
            No problems match your filters.
          </div>
        )}
      </div>
    </>
  );
}