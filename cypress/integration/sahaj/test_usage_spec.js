describe("Login functionality & Master reset works", function() {
    it("Master Reset Works and Login with predefined IDs work", function() {
        cy.visit("/")
        cy.get("input[name='email']").type("david@williams.com")
        cy.get("input[name='password']").type("password123")
        cy.get("button[name='btn_reset']").click()
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get("button[name='btn_logout']").click()
        cy.url().should('include', '/')
        cy.get("input[name='email']").type("john@doe.com")
        cy.get("input[name='password']").type("password@123")
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get("button[name='btn_logout']").should('be.visible')
        cy.get("button[name='btn_logout']").click()
        cy.url().should('include', '/')
        cy.get("input[name='email']").type("wrong@user.com")
        cy.get("input[name='password']").type("wrongpassword")
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/')
    })
})

describe("Basic Inbox Functionality", function() {
    it("Inbox folder changing works and updates headers accordingly", function() {
        cy.visit("/")
        cy.get("input[name='email']").type("david@williams.com")
        cy.get("input[name='password']").type("password123")
        cy.get("button[name='btn_reset']").click()
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get('h1').should('contain', 'Inbox')
        cy.get('.inboxLeftPanel > :nth-child(2) > .v-item-group > :nth-child(2)').click() //click Inbox in folder list
        cy.get('h1').should('contain', 'Sent Mail')
        cy.get('.inboxLeftPanel > :nth-child(2) > .v-item-group > :nth-child(1)').click() //click Sent Mail in folder list
        cy.get('h1').should('contain', 'Inbox')
    })
})

describe("Read Email Functionality", function() {
    it("Emails can be read and inbox count reduces", function() {
        cy.visit("/")
        cy.get("input[name='email']").type("david@williams.com")
        cy.get("input[name='password']").type("password123")
        cy.get("button[name='btn_reset']").click()
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get('h1').should('contain', 'Inbox')
        cy.get('span.v-chip').should('contain', '9') //check inbox unread count
        cy.get(':nth-child(4) > .v-badge__badge').should('contain', '9') //check unread count top right
        cy.get(':nth-child(2) > .text-right').click() //click unread email
        cy.get('.emailBodyStyled').type('{esc}') //click outside read email view
        cy.get('span.v-chip').should('contain', '8') //unread count should reduce by 1
        cy.get(':nth-child(4) > .v-badge__badge').should('contain', '8') //check unread count top right
        cy.get(':nth-child(3) > .text-right').click() //click unread email
        cy.get('.emailBodyStyled').type('{esc}') //click outside read email view
        cy.get('span.v-chip').should('contain', '7') //unread count should reduce by 1
        cy.get(':nth-child(4) > .v-badge__badge').should('contain', '7') //check unread count top right
        cy.get(':nth-child(4) > .text-right').click() //click unread email
        cy.get('.emailBodyStyled').type('{esc}') //click outside read email view
        cy.get('span.v-chip').should('contain', '6') //unread count should reduce by 1
        cy.get(':nth-child(4) > .v-badge__badge').should('contain', '6') //check unread count top right
    })
})

describe("Compose Email Functionality", function() {
    it("Can compose an email, see it in sent folder, logout and see in recipient inbox", function() {
        cy.visit("/")
        cy.get("input[name='email']").type("david@williams.com")
        cy.get("input[name='password']").type("password123")
        cy.get("button[name='btn_reset']").click()
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get("h1").should('contain', 'Inbox')
        cy.get("button[name='btn_compose_mail']").click({force: true});
        cy.get(".headline").should('contain', 'Compose Mail');
        cy.get("button[name='btn_cancel_compose_mail']").click();
        cy.get("button[name='btn_compose_mail']").click({force: true});
        cy.get(".headline").should('contain', 'Compose Mail');
        cy.get("input[name='email_to']").type("john@doe.com");
        cy.get("input[name='email_subject']").type("Automated Test Email");
        cy.get("textarea[name='email_body']").type("Hi Tester, This is a test email from a headless browser! Bye!");
        cy.get("button[name='btn_send_email']").click();
        cy.get('.inboxLeftPanel > :nth-child(2) > .v-item-group > :nth-child(2)').click()
        cy.get('h1').should('contain', 'Sent Mail')
        cy.get('h1').should('contain', '1') //first user should have 1 new sent email
        cy.get("button[name='btn_logout']").should('be.visible')
        cy.get("button[name='btn_logout']").click()
        cy.get("input[name='email']").type("john@doe.com")
        cy.get("input[name='password']").type("password@123")
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get("h1").should('contain', 'Inbox')
        cy.get("h1").should('contain', '1') //second user email inbox should have new email and unread count should be 1
        cy.get("span.v-chip").should('contain', '1') //second user email inbox should have new email and unread count should be 1
        cy.get(".text-right").click(); //click only email in second users's inbox
        cy.get("i[name='senderDetails']").should('contain', 'David Williams (david@williams.com)')
        cy.get("i[name='emailSubject']").should('contain', 'Automated Test Email')
        cy.get("pre.emailBodyStyled").should('contain', 'Hi Tester, This is a test email from a headless browser! Bye!')
        cy.get(".emailBodyStyled").type('{esc}') //click outside read email view
        cy.get("span.v-chip").should("not.be.visible") //inbox counter chip shouldn't be visible after all emails have been read
        cy.get("button[name='btn_logout']").should('be.visible')
        cy.get("button[name='btn_logout']").click()
    })
})

describe("Delete Functionality", function() {
    it("Can select emails and delete them", function() {
        cy.visit("/")
        cy.get("input[name='email']").type("david@williams.com")
        cy.get("input[name='password']").type("password123")
        cy.get("button[name='btn_reset']").click()
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get("h1").should('contain', 'Inbox')
        cy.get("h1").should('contain', '9') //inbox starts with 9 unread emails
        cy.get("span.v-chip").should('contain', '9') //inbox starts with 9 unread emails
        cy.get(':nth-child(2) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple').click();
        cy.get(':nth-child(3) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple').click();
        cy.get(':nth-child(4) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple').click();
        cy.get("button[name='btn_delete_email']").click(); //delete 3 selected unread emails
        cy.get("h1").should('contain', '6') //inbox unread count should decrease to 6
        cy.get("span.v-chip").should('contain', '6') //inbox unread count should decrease to 6
        cy.get(':nth-child(2) > :nth-child(1) > .v-data-table__checkbox > .v-input--selection-controls__ripple').click();
        cy.get("button[name='btn_delete_email']").click(); //delete only 1 selected unread email
        cy.get("h1").should('contain', '5') //inbox unread count should decrease to 5
        cy.get("span.v-chip").should('contain', '5') //inbox unread count should decrease to 6
        cy.get("button[name='btn_logout']").should('be.visible')
        cy.get("button[name='btn_logout']").click()
    })
})

describe("Inbox Search Functionality", function() {
    it("Able to search for emails and results update accordingly", function() {
        cy.visit("/")
        cy.get("input[name='email']").type("david@williams.com")
        cy.get("input[name='password']").type("password123")
        cy.get("button[name='btn_reset']").click()
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get("h1").should('contain', 'Inbox')
        cy.get('tbody').children().its('length').should('eq', 10) //on first login inbox rows should be 10
        cy.get("input[name='input_navbar_search_filter']").type("facebook") //type text into navbar search filter
        cy.get('tbody').children().its('length').should('eq', 1) //with search filter inbox count should match results, i.e. 1
        cy.get("input[name='input_navbar_search_filter']").clear() //clear search
        cy.get('tbody').children().its('length').should('eq', 10) //inbox rows should return to 10
        cy.get("input[name='input_search_filter']").type("google") //type text into navbar search filter
        cy.get('tbody').children().should('contain', 'No matching records found') //with search filter, if no matching emails found, nothing should be shown
        cy.get("input[name='input_search_filter']").clear() //clear search
        cy.get("button[name='btn_logout']").should('be.visible')
        cy.get("button[name='btn_logout']").click()
    })
})

describe("Sidebar Functionality", function() {
    it("Can expand and collapse navigation sidebar", function() {
        cy.visit("/")
        cy.get("input[name='email']").type("david@williams.com")
        cy.get("input[name='password']").type("password123")
        cy.get("button[name='btn_reset']").click()
        cy.get("button[name='btn_login']").click()
        cy.url().should('include', '/inbox')
        cy.get("h1").should('contain', 'Inbox')
        cy.get('div.current_user_name').contains('David Williams').should('be.visible') //in expanded mode, user's name should be visible in sidebar
        cy.get("button[name='btn_toggle_mini']").click(); //click mini mode toggle
        cy.get('div.current_user_name').should('not.exist'); //in mini mode user name section shouldn't exist
        cy.get("button[name='btn_toggle_mini']").click(); //click mini mode toggle to make sidebar expanded again
        cy.get('div.current_user_name').contains('David Williams').should('be.visible') //in expanded mode, user's name should be visible in sidebar again
        cy.get("button[name='btn_logout']").should('be.visible')
        cy.get("button[name='btn_logout']").click()
    })
})