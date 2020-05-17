import Denatural from '../objects/Denatural';



const cli = () => {
    const denatural = new Denatural(process.argv);
    denatural.main();
}


export default cli;
