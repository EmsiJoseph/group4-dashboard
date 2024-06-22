.PHONY: client server clean

client: clean
	cd client && npm run dev

server:
	cd server && python app.py

clean:
	if exist client\.next rmdir /s /q client\.next
