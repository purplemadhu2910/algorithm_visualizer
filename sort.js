let currentArray = [];
let steps = [];

function setArray() {
    const input = document.getElementById('arrayInput').value;
    if (input.trim() === '') {
        alert('Please enter an array');
        return;
    }
    
    currentArray = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    document.getElementById('currentArray').textContent = '[' + currentArray.join(', ') + ']';
    document.getElementById('steps').innerHTML = '';
    document.getElementById('finalResult').innerHTML = '';
}

function startSort(algorithm) {
    if (currentArray.length === 0) {
        alert('Please set an array first');
        return;
    }
    
    steps = [];
    currentAlgorithmType = algorithm;
    let arr = [...currentArray];
    
    switch(algorithm) {
        case 'bubble':
            bubbleSort(arr);
            break;
        case 'selection':
            selectionSort(arr);
            break;
        case 'insertion':
            insertionSort(arr);
            break;
        case 'quick':
            quickSort(arr, 0, arr.length - 1);
            break;
        case 'merge':
            mergeSort(arr, 0, arr.length - 1);
            break;
    }
    
    displaySteps();
}

function bubbleSort(arr) {
    let n = arr.length;
    steps.push(`Starting Bubble Sort with array: [${arr.join(', ')}]`);
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        steps.push(`Pass ${i + 1}:`);
        
        for (let j = 0; j < n - i - 1; j++) {
            steps.push(`  Comparing ${arr[j]} and ${arr[j + 1]}`);
            
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                steps.push(`  Swapped! Array: [${arr.join(', ')}]`);
            } else {
                steps.push(`  No swap needed`);
            }
        }
        
        if (!swapped) {
            steps.push(`No swaps in this pass - array is sorted!`);
            break;
        }
    }
    
    steps.push(`Final sorted array: [${arr.join(', ')}]`);
}

function selectionSort(arr) {
    let n = arr.length;
    steps.push(`Starting Selection Sort with array: [${arr.join(', ')}]`);
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        steps.push(`Pass ${i + 1}: Finding minimum from position ${i}`);
        
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                steps.push(`  New minimum found: ${arr[j]} at position ${j}`);
            }
        }
        
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            steps.push(`  Swapped ${arr[minIdx]} with ${arr[i]}`);
            steps.push(`  Array: [${arr.join(', ')}]`);
        } else {
            steps.push(`  No swap needed - ${arr[i]} is already in correct position`);
        }
    }
    
    steps.push(`Final sorted array: [${arr.join(', ')}]`);
}

function insertionSort(arr) {
    steps.push(`Starting Insertion Sort with array: [${arr.join(', ')}]`);
    
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        steps.push(`Pass ${i}: Inserting ${key} into sorted portion`);
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            steps.push(`  Moved ${arr[j]} to position ${j + 1}`);
            j--;
        }
        
        arr[j + 1] = key;
        steps.push(`  Inserted ${key} at position ${j + 1}`);
        steps.push(`  Array: [${arr.join(', ')}]`);
    }
    
    steps.push(`Final sorted array: [${arr.join(', ')}]`);
}

function quickSort(arr, low, high) {
    if (low === 0 && high === arr.length - 1) {
        steps.push(`Starting Quick Sort with array: [${arr.join(', ')}]`);
    }
    
    if (low < high) {
        let pi = partition(arr, low, high);
        steps.push(`Partitioned around pivot ${arr[pi]} at position ${pi}`);
        steps.push(`Array: [${arr.join(', ')}]`);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    
    if (low === 0 && high === arr.length - 1) {
        steps.push(`Final sorted array: [${arr.join(', ')}]`);
    }
}

function partition(arr, low, high) {
    let pivot = arr[high];
    steps.push(`Partitioning from ${low} to ${high}, pivot = ${pivot}`);
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push(`  Swapped ${arr[j]} and ${arr[i]}`);
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

function mergeSort(arr, left, right) {
    if (left === 0 && right === arr.length - 1) {
        steps.push(`Starting Merge Sort with array: [${arr.join(', ')}]`);
    }
    
    if (left < right) {
        let mid = Math.floor((left + right) / 2);
        steps.push(`Dividing array from ${left} to ${right}, mid = ${mid}`);
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
    
    if (left === 0 && right === arr.length - 1) {
        steps.push(`Final sorted array: [${arr.join(', ')}]`);
    }
}

function merge(arr, left, mid, right) {
    let leftArr = arr.slice(left, mid + 1);
    let rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push(`Merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }
    
    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }
    
    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }
    
    steps.push(`Merged result: [${arr.slice(left, right + 1).join(', ')}]`);
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
    summaryDiv.innerHTML = getAlgorithmSummary();
    stepsContainer.appendChild(summaryDiv);
    
    document.getElementById('finalResult').innerHTML = 'Sorting completed! Algorithm summary added below.';
}

function getAlgorithmSummary() {
    const algorithm = getCurrentAlgorithm();
    const summaries = {
        bubble: `
            <h4>Bubble Sort Summary:</h4>
            <p><strong>Time Complexity:</strong> O(n²) worst/average case, O(n) best case</p>
            <p><strong>Space Complexity:</strong> O(1)</p>
            <p><strong>How it works:</strong> Repeatedly compares adjacent elements and swaps them if they're in wrong order</p>
            <p><strong>Best for:</strong> Small datasets, educational purposes</p>
            <p><strong>Stable:</strong> Yes</p>
        `,
        selection: `
            <h4>Selection Sort Summary:</h4>
            <p><strong>Time Complexity:</strong> O(n²) all cases</p>
            <p><strong>Space Complexity:</strong> O(1)</p>
            <p><strong>How it works:</strong> Finds minimum element and places it at the beginning, repeats for remaining array</p>
            <p><strong>Best for:</strong> Small datasets, when memory writes are costly</p>
            <p><strong>Stable:</strong> No</p>
        `,
        insertion: `
            <h4>Insertion Sort Summary:</h4>
            <p><strong>Time Complexity:</strong> O(n²) worst/average case, O(n) best case</p>
            <p><strong>Space Complexity:</strong> O(1)</p>
            <p><strong>How it works:</strong> Builds sorted array one element at a time by inserting each element in correct position</p>
            <p><strong>Best for:</strong> Small datasets, nearly sorted arrays</p>
            <p><strong>Stable:</strong> Yes</p>
        `,
        quick: `
            <h4>Quick Sort Summary:</h4>
            <p><strong>Time Complexity:</strong> O(n log n) average case, O(n²) worst case</p>
            <p><strong>Space Complexity:</strong> O(log n)</p>
            <p><strong>How it works:</strong> Divides array around pivot, recursively sorts sub-arrays</p>
            <p><strong>Best for:</strong> Large datasets, general purpose sorting</p>
            <p><strong>Stable:</strong> No</p>
        `,
        merge: `
            <h4>Merge Sort Summary:</h4>
            <p><strong>Time Complexity:</strong> O(n log n) all cases</p>
            <p><strong>Space Complexity:</strong> O(n)</p>
            <p><strong>How it works:</strong> Divides array into halves, sorts them, then merges sorted halves</p>
            <p><strong>Best for:</strong> Large datasets, when stable sort is needed</p>
            <p><strong>Stable:</strong> Yes</p>
        `
    };
    
    return summaries[algorithm] || '<p>Algorithm summary not available</p>';
}

let currentAlgorithmType = '';

function getCurrentAlgorithm() {
    return currentAlgorithmType;
}