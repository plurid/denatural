import Denatural from '../../../';



describe('Denatural', () => {
    it('specific/control/for', () => {
        const forText = `
            for (var i = 0; i < 100; i = i + 1) {
                print i;
            }
        `;

        Denatural.run(forText);

        expect(true).toBeTruthy();
    });
});
