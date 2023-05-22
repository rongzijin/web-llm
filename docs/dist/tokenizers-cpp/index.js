var Module = (() => {
  var _scriptDir = import.meta.url;
  
  return (
async function(Module = {})  {



  return Module.ready
}

);
})();

var binding = null;
async function asyncInitTokenizers() {
    if (binding == null) {
        binding = await Module();
    }
}
/**
 * A universal tokenizer that is backed by either
 * HF tokenizers rust library or sentencepiece
 */
class Tokenizer {
    constructor(tokenizer) {
        this.handle = tokenizer;
    }
    /**
     * Dispose this tokenizer.
     *
     * Call this function when we no longer needs to
     */
    dispose() {
        this.handle.delete();
    }
    /**
     * Encode text to token ids.
     *
     * @param text Input text.
     * @returns The output tokens
     */
    encode(text) {
        let ids = this.handle.Encode(text);
        let arr = binding.vecIntToView(ids).slice();
        ids.delete();
        return arr;
    }
    /**
     * Decode the token ids into string.
     *
     * @param ids the input ids.
     * @returns The decoded string.
     */
    decode(ids) {
        let vec = binding.vecIntFromJSArray(ids);
        let res = this.handle.Decode(vec).slice();
        vec.delete();
        return res;
    }
    /**
     * Create a tokenizer from jsonArrayBuffer
     *
     * @param json The input array buffer that contains json text.
     * @returns The tokenizer
     */
    static async fromJSON(json) {
        await asyncInitTokenizers();
        return new Tokenizer(binding.Tokenizer.FromBlobJSON(json));
    }
    /**
     * Create a tokenizer from byte-level BPE blobs.
     *
     * @param vocab The vocab blob.
     * @param merges The merges blob.
     * @param addedTokens The addedTokens blob
     * @returns The tokenizer
     */
    static async fromByteLevelBPE(vocab, merges, addedTokens = "") {
        await asyncInitTokenizers();
        return new Tokenizer(binding.Tokenizer.FromBlobByteLevelBPE(vocab, merges, addedTokens));
    }
    /**
     * Create a tokenizer from sentencepiece model.
     *
     * @param model The model blob.
     * @returns The tokenizer
     */
    static async fromSentencePiece(model) {
        await asyncInitTokenizers();
        return new Tokenizer(binding.Tokenizer.FromBlobSentencePiece(model));
    }
}

var index = { Tokenizer };

export { Tokenizer, index as default };