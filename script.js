function getCookieId() {
    let cookieId = localStorage.getItem('cookieId');

    if (!cookieId) {
        cookieId = 'C-' + Date.now();
        localStorage.setItem('cookieId', cookieId);
    }

    return cookieId;
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
        sessionId = 'S-' + Date.now();
        sessionStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
}

function trackActivity(activityType, productViewed) {
    const activity = {
        sessionId: getSessionId(),
        cookieId: getCookieId(),
        activityType: activityType,
        productViewed: productViewed || '',
        timestamp: new Date().toISOString()
    };

    let activities = JSON.parse(localStorage.getItem('websiteActivities')) || [];
    activities.push(activity);

    localStorage.setItem('websiteActivities', JSON.stringify(activities));

    console.log('Tracked Activity:', activity);
}

function trackProductView(productCategory) {
    trackActivity('Product View', productCategory);
    alert(productCategory + ' product view tracked.');
}

function submitForm(event) {
    event.preventDefault();

    const formSubmission = {
        cookieId: getCookieId(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('formSubmission', JSON.stringify(formSubmission));

    trackActivity('Form Submission', '');

    document.getElementById('message').innerText =
        'Form submitted successfully. Check browser console/localStorage for captured data.';

    console.log('Form Submission:', formSubmission);
}

trackActivity('Page View', '');
