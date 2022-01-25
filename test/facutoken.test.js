const FacuToken = artifacts.require('FacuToken');
const FacuTokenSale = artifacts.require('FacuTokenSale');

contract('FacuToken', () => {
    const initAmount = BigInt(750000000 * 10**18);
    it('Se inicializó el contrato con los valores apropiados', () => {
        FacuToken.deployed().then((FT) => {
            FacuTokenSale.deployed().then((FTS) => {
                FT.transfer(FTS.address, initAmount)
            });
        })
    });
});