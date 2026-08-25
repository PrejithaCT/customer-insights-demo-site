/* =========================================================
   LOCAL COOKIE / SESSION TRACKING
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


/* =========================================================
   LOCAL ACTIVITY TRACKING
   ========================================================= */

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


/* =========================================================
   OLD PRODUCT VIEW FUNCTION
   ========================================================= */

function trackProductView(productCategory) {

    trackActivity(
        'Product View',
        productCategory
    );

    console.log(
        'Local product view tracked:',
        productCategory
    );
}


/* =========================================================
   CONTACT FORM SUBMISSION
   ========================================================= */

function submitForm(event) {

    event.preventDefault();

    const fullName =
        document.getElementById('name').value.trim();

    const email =
        document.getElementById('email').value.trim();


    /* Split name */

    const nameParts =
        fullName.split(/\s+/);

    const firstName =
        nameParts[0];

    const lastName =
        nameParts.length > 1
            ? nameParts.slice(1).join(' ')
            : 'NA';


    console.log(
        'CONTACT FORM SUBMITTED:',
        {
            firstName,
            lastName,
            email
        }
    );


    /* =====================================================
       LOCAL STORAGE DEMO
       ===================================================== */

    const formSubmission = {

        cookieId:
            getCookieId(),

        sessionId:
            getSessionId(),

        name:
            fullName,

        email:
            email,

        timestamp:
            new Date().toISOString()

    };


    localStorage.setItem(
        'formSubmission',
        JSON.stringify(formSubmission)
    );


    trackActivity(
        'Form Submission',
        ''
    );


    console.log(
        'Local Form Submission:',
        formSubmission
    );


    /* =====================================================
       SALESFORCE PROFILE EVENT 1
       IDENTITY
       ===================================================== */

    console.log(
        'Sending Salesforce Identity Event...'
    );


    SalesforceInteractions.sendEvent({

        user: {

            attributes: {

                eventType:
                    'identity',

                firstName:
                    firstName,

                lastName:
                    lastName,

                /*
                   Salesforce recommended identity schema:

                   0 = Anonymous
                   1 = Known
                */

                isAnonymous:
                    '1'

            }

        }

    });


    console.log(
        'Identity sendEvent() called'
    );


    /* =====================================================
       SALESFORCE PROFILE EVENT 2
       CONTACT POINT EMAIL
       ===================================================== */

    console.log(
        'Sending Salesforce Contact Point Email Event...'
    );


    SalesforceInteractions.sendEvent({

        user: {

            attributes: {

                eventType:
                    'contactPointEmail',

                email:
                    email

            }

        }

    });


    console.log(
        'Contact Point Email sendEvent() called'
    );


    /* =====================================================
       UI MESSAGE
       ===================================================== */

    document
        .getElementById('message')
        .innerText =
        'Form submitted successfully.';


    /*
       Don't reload / redirect immediately.

       Give the SDK time to send the events.
    */

}


/* =========================================================
   SALESFORCE SDK INITIALIZATION
   ========================================================= */

if (
    typeof SalesforceInteractions !==
    'undefined'
) {

    console.log(
        'SalesforceInteractions library found'
    );


    SalesforceInteractions.init({

        consents: [

            {

                provider:
                    'Website',

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


        /* ===============================================
           CONTACT PAGE
           =============================================== */

        const contactForm =
            document.getElementById(
                'contactForm'
            );


        if (contactForm) {

            console.log(
                'Contact form found'
            );


            contactForm.addEventListener(
                'submit',
                submitForm
            );


            console.log(
                'Contact form listener attached'
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
else {

    console.error(
        'SalesforceInteractions SDK not found'
    );

}


/* =========================================================
   LOCAL PAGE VIEW
   ========================================================= */

trackActivity(
    'Page View',
    ''
);
