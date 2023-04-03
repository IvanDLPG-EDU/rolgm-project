FROM 	node

LABEL 	"IvanDeLaPoza" "5593312@alu.murciaeduca.es"
	
EXPOSE 	5173

WORKDIR	/app

COPY 	package.json .

RUN	npm i

ENTRYPOINT [ "yarn", "dev", "--host" ]
