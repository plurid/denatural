#![allow(dead_code)]
#![allow(unused_variables)]
#![allow(unused_parens)]
#![allow(unused_macros)]


pub fn grow_capacity(
    capacity: i8,
) -> i8 {
    if capacity < 8 {
        return 8;
    } else {
        return capacity * 2;
    }
}

pub fn grow_array(

) {

}

pub fn free_array(

) {

}


pub enum OpCode {
    OpReturn,
}


#[derive(Debug)]
pub struct Chunk {
    pub count: i8,
    pub capacity: i8,
    pub code: Option<Vec<u8>>,
}



pub fn init_chunk(
    chunk: &mut Chunk,
) {
    println!("initChunk");

    chunk.count = 1;
    chunk.capacity = 0;
    chunk.code = None;
}


pub fn free_chunk(
    chunk: &mut Chunk,
) {
    println!("freeChunk");

    // free_array!(u8, chunk.code, chunk.capcity);
    // init_chunk(&mut chunk);
}


pub fn write_chunk(
    chunk: &mut Chunk,
    byte: OpCode,
) {
    println!("writeChunk");

    if (chunk.capacity < chunk.count + 1) {
        let old_capacity = chunk.capacity;
        chunk.capacity = grow_capacity(old_capacity);
        // chunk.code = grow_array!(chunk.code, u8, oldCapacity, chunk.capacity);
    }

    // let current_chunk = match chunk.code {
    //     Some(x) => Ok(x[chunk.count]),
    //     None => Err(None),
    // };

    // chunk.code[chunk.count] = byte;
    // chunk.count++;
}
