
module.exports = function decodeFrame(frame) {
	var counter = 0;
	
	var fin_offset = 7,
		opcode_offset = parseInt(1111, 2),
		mask_offset = 7,
		payload_len_offset = parseInt(1111111, 2);

	var FIN = frame[counter] >> fin_offset,
		Opcode = frame[counter++] & opcode_offset,
		MASK = frame[counter] >> mask_offset,
		Payload_len = frame[counter++] & payload_len_offset;
console.log(Payload_len);
	Payload_len === 126 && 
	(Payload_len = 
		(frame[counter] << 8) + 
		frame[++counter]) && 
	counter++;
console.log(Payload_len);	
	Payload_len === 127 && 
	(Payload_len = 
		(frame[counter] << 56) + 
		(frame[++counter] << 48) +
		(frame[++counter] << 40) + 
		(frame[++counter] << 32) + 
		(frame[++counter] << 24) + 
		(frame[++counter] << 16) + 
		(frame[++counter] << 8) +
		frame[++counter]) && 
	counter++;

	var Payload_data = [];

	if (MASK) {
		var Masking_key = [];

		Masking_key.push(
			frame[counter++], 
			frame[counter++], 
			frame[counter++], 
			frame[counter++]
		);

		for (var i = 0; i < Payload_len; i++) {
			var j = i % 4;
			frame[counter + i] ^= Masking_key[j];
		}
	}

	return {
		FIN: FIN,
		Opcode: Opcode,
		MASK: MASK,
		Payload_len: Payload_len,
		Payload_data: frame.slice(counter, Payload_len)
	}
};