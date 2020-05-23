import DenaturalClass from '../Class';



class DenaturalInstance {
    private denaturalClass: DenaturalClass;

    constructor(
        denaturalClass: DenaturalClass,
    ) {
        this.denaturalClass = denaturalClass;
    }

    toString() {
        return this.denaturalClass.name + ' instance';
    }
}


export default DenaturalInstance;
