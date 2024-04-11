describe('Keywordmanager Tests', () => {
  beforeEach(() => {
    cy.autologin();
    cy.visit('/');
    cy.createContentWithKeyword({
      contentType: 'Document',
      contentId: 'my-page',
      contentTitle: 'My Page',
      subjects: ['Foo', 'Bar', 'BarFoo'],
    });
    cy.visit('controlpanel/keywords');
  });

  it('As SiteAdmin I can search for specific Keywords', () => {
    cy.get('span > .input > input').clear('F');
    cy.get('span > .input > input').type('Foo');
    cy.get(':nth-child(1) > .keyword > text').should('have.text', 'Foo');
  });

  it('As SiteAdmin I can change Keywords from multiple to one', () => {
    cy.get('.left').click();
    cy.get(':nth-child(1) > .keyword > .ui').click();
    cy.get(':nth-child(3) > .keyword > .ui').click();
    cy.get('#changeto').clear('F');
    cy.get('#changeto').type('Foobar');

    cy.get(':nth-child(3) > .button').click();
    cy.get('.red').click();
    cy.get(':nth-child(2) > .keyword > .keywords-special').should(
      'have.text',
      'Foobar',
    );
  });

  it('As Site Admin I can bulk delete Keywords', () => {
    cy.get('.floated > .right').click();
    cy.get(':nth-child(1) > .keyword > .ui').click();
    cy.get(':nth-child(2) > .keyword > .ui').click();
    cy.get('.container > :nth-child(3) > .ui').click();
    cy.get('.red').click();
    cy.get('.keywords-special').should('have.text', 'Foo');
  });
});
