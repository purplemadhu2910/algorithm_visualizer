let currentArray = [];
let targetValue = null;
let steps = [];

function setArray() {
    const arrayInput = document.getElementById('arrayInput').value;
    const targetInput = document.getElementById('targetInput').value;
    
    if (arrayInput.trim() === '' || targetInput.trim() === '') {
        alert('Please enter both array and target value');
        return;
    }
    
    currentArray = arrayInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    targetValue = parseInt(targetInput);
    
    document.getElementById('currentArray').textContent = '[' + currentArray.join(', ') + ']';
    document.getElementById('currentTarget').textContent = targetValue;
    document.getElementById('steps').innerHTML = '';
    document.getElementById('finalResult').innerHTML = '';
}

function startSearch(algorithm) {
    if (currentArray.length === 0 || targetValue === null) {
        alert('Please set array and target value first');
        return;
    }
    
    steps = [];
    currentSearchAlgorithmType = algorithm;
    
    switch(algorithm) {
        case 'linear':
            linearSearch(currentArray, targetValue);
            break;
        case 'binary':
            binarySearch([...currentArray].sort((a, b) => a - b), targetValue);
            break;
        case 'bfs':
            breadthFirstSearch(currentArray, targetValue);
            break;
        case 'dfs':
            depthFirstSearch(currentArray, targetValue);
            break;
    }
    
    displaySteps();
}

function linearSearch(arr, target) {
    steps.push(`Starting Linear Search for ${target} in array: [${arr.join(', ')}]`);
    
    for (let i = 0; i < arr.length; i++) {
        steps.push(`Step ${i + 1}: Checking position ${i}, value = ${arr[i]}`);
        
        if (arr[i] === target) {
            steps.push(`✓ Found ${target} at position ${i}!`);
            return i;
        } else {
            steps.push(`  ${arr[i]} ≠ ${target}, continue searching...`);
        }
    }
    
    steps.push(`✗ ${target} not found in the array`);
    return -1;
}

function binarySearch(arr, target) {
    steps.push(`Starting Binary Search for ${target} in sorted array: [${arr.join(', ')}]`);
    
    let left = 0;
    let right = arr.length - 1;
    let step = 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        steps.push(`Step ${step}: left=${left}, right=${right}, mid=${mid}`);
        steps.push(`  Checking middle element: arr[${mid}] = ${arr[mid]}`);
        
        if (arr[mid] === target) {
            steps.push(`✓ Found ${target} at position ${mid}!`);
            return mid;
        } else if (arr[mid] < target) {
            steps.push(`  ${arr[mid]} < ${target}, search right half`);
            left = mid + 1;
        } else {
            steps.push(`  ${arr[mid]} > ${target}, search left half`);
            right = mid - 1;
        }
        step++;
    }
    
    steps.push(`✗ ${target} not found in the array`);
    return -1;
}

function breadthFirstSearch(arr, target) {
    steps.push(`Starting BFS for ${target} in array: [${arr.join(', ')}]`);
    steps.push(`Building binary search tree from array...`);
    
    // Create a simple binary tree representation
    let tree = buildBinaryTree(arr);
    steps.push(`Tree structure: ${JSON.stringify(tree, null, 2)}`);
    
    if (!tree) {
        steps.push(`Empty tree, ${target} not found`);
        return -1;
    }
    
    let queue = [tree];
    let level = 1;
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        steps.push(`Level ${level}: Processing ${levelSize} nodes`);
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            steps.push(`  Visiting node: ${node.value}`);
            
            if (node.value === target) {
                steps.push(`✓ Found ${target} using BFS!`);
                return node.value;
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        level++;
    }
    
    steps.push(`✗ ${target} not found using BFS`);
    return -1;
}

function depthFirstSearch(arr, target) {
    steps.push(`Starting DFS for ${target} in array: [${arr.join(', ')}]`);
    steps.push(`Building binary search tree from array...`);
    
    let tree = buildBinaryTree(arr);
    steps.push(`Tree structure: ${JSON.stringify(tree, null, 2)}`);
    
    if (!tree) {
        steps.push(`Empty tree, ${target} not found`);
        return -1;
    }
    
    function dfsHelper(node, depth = 1) {
        if (!node) return false;
        
        steps.push(`Depth ${depth}: Visiting node ${node.value}`);
        
        if (node.value === target) {
            steps.push(`✓ Found ${target} using DFS at depth ${depth}!`);
            return true;
        }
        
        steps.push(`  ${node.value} ≠ ${target}, exploring children...`);
        
        if (dfsHelper(node.left, depth + 1)) return true;
        if (dfsHelper(node.right, depth + 1)) return true;
        
        return false;
    }
    
    if (!dfsHelper(tree)) {
        steps.push(`✗ ${target} not found using DFS`);
        return -1;
    }
    
    return target;
}

function buildBinaryTree(arr) {
    if (arr.length === 0) return null;
    
    class TreeNode {
        constructor(value) {
            this.value = value;
            this.left = null;
            this.right = null;
        }
    }
    
    let root = new TreeNode(arr[0]);
    
    for (let i = 1; i < arr.length; i++) {
        insertIntoBST(root, arr[i]);
    }
    
    return root;
}

function insertIntoBST(root, value) {
    if (value < root.value) {
        if (root.left === null) {
            root.left = { value: value, left: null, right: null };
        } else {
            insertIntoBST(root.left, value);
        }
    } else {
        if (root.right === null) {
            root.right = { value: value, left: null, right: null };
        } else {
            insertIntoBST(root.right, value);
        }
    }
}

function displaySteps() {
    const stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = '';
    
    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.textContent = `${index + 1}. ${step}`;
        stepsContainer.appendChild(stepDiv);
    });
    
    // Add algorithm summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'algorithm-summary';
    summaryDiv.innerHTML = getSearchAlgorithmSummary();
    stepsContainer.appendChild(summaryDiv);
    
    document.getElementById('finalResult').innerHTML = 'Search completed! Algorithm summary added below.';
}

function getSearchAlgorithmSummary() {
    const algorithm = getCurrentSearchAlgorithm();
    const summaries = {
        linear: `
            <h4>Linear Search Summary:</h4>
            <p><strong>Time Complexity:</strong> O(n) all cases</p>
            <p><strong>Space Complexity:</strong> O(1)</p>
            <p><strong>How it works:</strong> Sequentially checks each element until target is found or array ends</p>
            <p><strong>Best for:</strong> Unsorted arrays, small datasets</p>
            <p><strong>Advantages:</strong> Simple, works on any array</p>
            <p><strong>Disadvantages:</strong> Slow for large datasets</p>
        `,
        binary: `
            <h4>Binary Search Summary:</h4>
            <p><strong>Time Complexity:</strong> O(log n) all cases</p>
            <p><strong>Space Complexity:</strong> O(1) iterative, O(log n) recursive</p>
            <p><strong>How it works:</strong> Repeatedly divides sorted array in half, eliminating half of remaining elements</p>
            <p><strong>Best for:</strong> Large sorted arrays</p>
            <p><strong>Advantages:</strong> Very fast for large datasets</p>
            <p><strong>Disadvantages:</strong> Requires sorted array</p>
        `,
        bfs: `
            <h4>Breadth First Search Summary:</h4>
            <p><strong>Time Complexity:</strong> O(V + E) where V=vertices, E=edges</p>
            <p><strong>Space Complexity:</strong> O(V)</p>
            <p><strong>How it works:</strong> Explores all nodes at current depth before moving to next depth level</p>
            <p><strong>Best for:</strong> Finding shortest path, level-order traversal</p>
            <p><strong>Advantages:</strong> Finds shortest path, complete algorithm</p>
            <p><strong>Disadvantages:</strong> Uses more memory than DFS</p>
        `,
        dfs: `
            <h4>Depth First Search Summary:</h4>
            <p><strong>Time Complexity:</strong> O(V + E) where V=vertices, E=edges</p>
            <p><strong>Space Complexity:</strong> O(V)</p>
            <p><strong>How it works:</strong> Explores as far as possible along each branch before backtracking</p>
            <p><strong>Best for:</strong> Topological sorting, detecting cycles, maze solving</p>
            <p><strong>Advantages:</strong> Uses less memory, good for deep trees</p>
            <p><strong>Disadvantages:</strong> May not find shortest path</p>
        `
    };
    
    return summaries[algorithm] || '<p>Algorithm summary not available</p>';
}

let currentSearchAlgorithmType = '';

function getCurrentSearchAlgorithm() {
    return currentSearchAlgorithmType;
}