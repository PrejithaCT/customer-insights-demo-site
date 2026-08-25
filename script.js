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

    let activities =
        JSON.parse(localStorage.getItem('websiteActivities')) || [];

    activities.push(activity);

    localStorage.setItem(
        'websiteActivities',
        JSON.stringify(activities)
    );

    console.log('Tracked Activity:', activity);
}

function trackProductView(productCategory) {
    trackActivity('Product View', productCategory);

    alert(productCategory + ' product view tracked.');
}

/* ---------------------------------
   CONTACT FORM + SALESFORCE SDK
---------------------------------- */

function submitForm(event) {

    event.preventDefault();

    const fullName =
        document.getElementById('name').value.trim();

    const email =
        document.getElementById('email').value.trim();

    const nameParts = fullName.split(' ');

    const firstName = nameParts[0];

    const lastName =
        nameParts.length > 1
            ? nameParts.slice(1).join(' ')
            : '';

    /* Existing localStorage demo data */
    const formSubmission = {

        cookieId: getCookieId(),

        name: fullName,

        email: email,

        timestamp: new Date().toISOString()

    };

    localStorage.setItem(
        'formSubmission',
        JSON.stringify(formSubmission)
    );

    trackActivity('Form Submission', '');

    console.log(
        'Form Submission:',
        formSubmission
    );


    /* REAL SALESFORCE IDENTITY EVENT */

    SalesforceInteractions.sendEvent({

        user: {

            attributes: {

                eventType: 'identity',

                firstName: firstName,

                lastName: lastName,

                isAnonymous: '0'

            },

            identities: {

                email: email

            }

        }

    });


    console.log(
        'Salesforce Identity Event Sent:',
        {
            firstName,
            lastName,
            email
        }
    );


    document.getElementById('message').innerText =
        'Form submitted successfully.';

}


/* ---------------------------------
   INITIALIZE SALESFORCE SDK
---------------------------------- */

if (typeof SalesforceInteractions !== 'undefined') {

    SalesforceInteractions.init({

        consents: [

            {

                provider: 'Website',

                purpose:
                    SalesforceInteractions
                        .ConsentPurpose
                        .Tracking,

                status:
                    SalesforceInteractions
                        .ConsentStatus
                        .OptIn

            }

        ]

    })
    .then(() => {

        console.log(
            'Salesforce SDK initialized on Contact page'
        );

        const contactForm =
            document.getElementById('contactForm');

        if (contactForm) {

            contactForm.addEventListener(
                'submit',
                submitForm
            );

        }

    })
    .catch(error => {

        console.error(
            'Salesforce SDK initialization failed:',
            error
        );

    });

}


/* Existing Page View tracking */

trackActivity('Page View', '');
