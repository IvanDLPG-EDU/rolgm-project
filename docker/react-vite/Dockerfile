FROM 	node

LABEL 	"IvanDeLaPoza" "5593312@alu.murciaeduca.es"
	
EXPOSE 	5173

WORKDIR	/

RUN yarn create vite app --template react

WORKDIR	/app

COPY 	./package.json .

RUN yarn

ENTRYPOINT [ "yarn", "dev", "--host" ]
