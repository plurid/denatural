#![allow(dead_code)]
#![allow(unused_variables)]
#![allow(unused_parens)]
#![allow(unused_macros)]


extern crate denatural_library as denatural;

use denatural::chunk::Chunk;
use denatural::chunk::OpCode;



fn main() {
    println!("denatural");

    let mut chunk = Chunk {
        count: 0,
        capacity: 0,
        code: None,
    };

    denatural::chunk::init_chunk(&mut chunk);
    denatural::chunk::free_chunk(&mut chunk);
    denatural::chunk::write_chunk(&mut chunk, OpCode::OpReturn);
    denatural::debug::disassemble_chunk(&mut chunk);

    println!("{:?}", chunk);
}
