all:
	cp ../lib/mjapi.js .
	cp ../lib/lib.sjs .
	sjs -r lib.sjs -o lib_wasm.js

clean:
	rm -f mjapi.js lib.sjs lib_wasm.js

.PHONY: all clean
