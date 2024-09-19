document.addEventListener('DOMContentLoaded', () => {
    const sleepForm = document.getElementById('sleep-form');
    const goalForm = document.getElementById('goal-form');
    const sleepList = document.getElementById('sleep-list');
    const analysis = document.getElementById('analysis');
    const tipsList = document.getElementById('tips-list');
    const tipDetail = document.getElementById('tip-detail');
    const tipText = document.getElementById('tip-text');

    // Initialize data from localStorage
    let sleepData = JSON.parse(localStorage.getItem('sleepData')) || [];
    let sleepGoal = parseFloat(localStorage.getItem('sleepGoal')) || 0;

    // Detailed Tips Data
    const tips = {
        'Stick to a consistent sleep schedule': 'Going to bed and waking up at the same time every day helps regulate your internal clock.',
        'Create a restful environment': 'Ensure your bedroom is dark, quiet, and cool. Consider using earplugs or an eye mask if necessary.',
        'Limit screen time before bed': 'The blue light from screens can interfere with your sleep. Try to avoid screens at least an hour before bed.',
        'Avoid large meals and caffeine close to bedtime': 'Heavy meals and caffeine can disrupt your sleep. Aim to finish eating and drinking caffeine at least a few hours before bed.',
        'Exercise regularly but not too close to bedtime': 'Regular physical activity can help you fall asleep faster and enjoy deeper sleep. However, avoid vigorous exercise close to bedtime.'
    };

    function renderSleepData() {
        sleepList.innerHTML = '';
        sleepData.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                <span>${entry.date}: ${entry.duration} hours, Quality: ${entry.quality}</span>
                <button class="btn btn-danger btn-sm float-right delete-entry" data-index="${index}">Delete</button>
            `;
            sleepList.appendChild(li);
        });
        renderAnalysis();
    }

    function renderAnalysis() {
        let totalDuration = sleepData.reduce((sum, entry) => sum + entry.duration, 0);
        let averageDuration = totalDuration / sleepData.length;
        analysis.innerHTML = `
            <h4>Analysis</h4>
            <p>Total Duration: ${totalDuration.toFixed(1)} hours</p>
            <p>Average Duration: ${averageDuration.toFixed(1)} hours</p>
            <p>Sleep Goal: ${sleepGoal.toFixed(1)} hours</p>
            <p>Achieved Goal: ${averageDuration >= sleepGoal ? 'Yes' : 'No'}</p>
        `;
    }

    function renderTips() {
        tipsList.innerHTML = '';
        Object.keys(tips).forEach(tip => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = tip;
            li.setAttribute('data-tip', tip);
            tipsList.appendChild(li);
        });
    }

    function showTipDetail(tip) {
        tipText.textContent = tips[tip];
        tipDetail.style.display = 'block';
    }

    function saveData() {
        localStorage.setItem('sleepData', JSON.stringify(sleepData));
        localStorage.setItem('sleepGoal', sleepGoal);
    }

    sleepForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const duration = parseFloat(document.getElementById('sleep-duration').value);
        const quality = parseInt(document.getElementById('sleep-quality').value, 10);
        const date = new Date().toLocaleDateString();
        sleepData.push({ date, duration, quality });
        saveData();
        renderSleepData();
        sleepForm.reset();
    });

    goalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        sleepGoal = parseFloat(document.getElementById('sleep-goal').value);
        saveData();
        renderAnalysis();
    });

    sleepList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-entry')) {
            const index = e.target.getAttribute('data-index');
            sleepData.splice(index, 1);
            saveData();
            renderSleepData();
        }
    });

    tipsList.addEventListener('click', function (e) {
        const tip = e.target.getAttribute('data-tip');
        if (tip) {
            showTipDetail(tip);
        }
    });

    // Initial rendering
    renderSleepData();
    renderTips();
});
