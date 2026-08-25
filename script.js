/* =========================================================
   LOCAL DEMO TRACKING
   ========================================================= */

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


/* =========================================================
   CONTACT FORM
   ========================================================= */

function submitForm(event) {

    event.preventDefault();

    const fullName =
        document.getElementById('name').value.trim();

    const email =
        document.getElementById('email').value.trim();

    const nameParts = fullName.split(/\s+/);

    const firstName = nameParts[0];

    const lastName =
        nameParts.length > 1
            ? nameParts.slice(1).join(' ')
            : 'NA';


    /* -----------------------------------------------------
       Keep local copy for demo/debugging
       ----------------------------------------------------- */

    const formSubmission = {
        cookieId: getCookieId(),
        sessionId: getSessionId(),
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


    /* =====================================================
       SALESFORCE PROFILE EVENT 1
       IDENTITY
       ===================================================== */

    SalesforceInteractions.sendEvent({

        user: {

            attributes: {

                eventType: 'identity',

                firstName: firstName,

                lastName: lastName,

                // 1 = known visitor
                isAnonymous: '1'

            }

        }

    })
    .then(() => {

        console.log(
            'Salesforce Identity event sent successfully'
        );

    })
    .catch(error => {

        console.error(
            'Identity event failed:',
            error
        );

    });


    /* =====================================================
       SALESFORCE PROFILE EVENT 2
       CONTACT POINT EMAIL
       ===================================================== */

    SalesforceInteractions.sendEvent({

        user: {

            attributes: {

                eventType: 'contactPointEmail',

                email: email

            }

        }

    })
    .then(() => {

        console.log(
            'Salesforce Contact Point Email event sent successfully'
        );

    })
    .catch(error => {

        console.error(
            'Contact Point Email event failed:',
            error
        );

    });


    document.getElementById('message').innerText =
        'Form submitted successfully.';

}


/* =========================================================
   SALESFORCE SDK INITIALIZATION
   ========================================================= */

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
            'Salesforce SDK initialized'
        );


        /* Only runs on contact.html */

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


/* =========================================================
   PAGE VIEW - LOCAL DEMO
   ========================================================= */

trackActivity('Page View', '');
