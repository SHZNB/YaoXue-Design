describe('Lab Workflow', () => {
  beforeEach(() => {
    // Mock authentication if needed or use a test account
    // For now, assuming we can access the lab directly or via login
    cy.visit('/lab/Chemistry/demo-id');
  });

  it('should load the chemistry lab', () => {
    cy.contains('试剂架').should('be.visible');
    cy.contains('蒸馏水').should('be.visible');
  });

  it('should allow adding chemicals', () => {
    cy.contains('蒸馏水').click();
    cy.contains('50 ml').should('be.visible');
    
    cy.contains('稀盐酸').click();
    cy.contains('100 ml').should('be.visible');
  });

  it('should generate report', () => {
    cy.contains('生成报告').click();
    cy.contains('实验报告').should('be.visible');
    cy.contains('下载 PDF').should('be.visible');
  });
});
