start: build run setup-data

start-localhost: build run setup-data seeding-data accept-localhost seeding-data

start-dev: build run setup-data seeding-data accept-dev seeding-data

build:
	docker-compose build

run:
	docker-compose up -d

setup-data:
	sleep 20
	cat database/clarisExport.sql | docker exec -i db-mysql /usr/bin/mysql -u root --password=admin1234 claris

seeding-data:
	cat database/tearup.sql | docker exec -i db-mysql /usr/bin/mysql -u root --password=admin1234 claris

teardown-data:
	cat database/clarisExport.sql | docker exec -i db-mysql /usr/bin/mysql -u root --password=admin1234 claris


accept-localhost:
	newman run atdd/api/deestone_download_pricebook.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_download_pricebook.json
	newman run atdd/api/wholesale_upload_inventory_success.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/wholesale_upload_inventory_success.json
	newman run atdd/api/deestone_upload_multiple_products.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_upload_multiple_products_success.json
	newman run atdd/api/deestone_create_new_product_manually.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_create_product_manually_success.json 
	newman run atdd/api/deestone_create_new_product_manually.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_create_product_manually_fail.json
	
	newman run atdd/api/deestone_update_product_price.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_update_product_success.json
	newman run atdd/api/deestone_update_product_price.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_update_product_fail.json
	
	newman run atdd/api/deestone_delete_product.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_delete_product_success.json 
	newman run atdd/api/deestone_delete_product.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/deestone_delete_product_fail.json 
	
	newman run atdd/api/wholesale_delete_product.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/wholesale_delete_product_fail.json
	newman run atdd/api/wholesale_delete_product.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/wholesale_delete_product_success.json

	newman run atdd/api/wholesaler_update_product_and_price_by_item.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/wholesaler_update_price_single_poduct_fail.json
	newman run atdd/api/wholesaler_update_product_and_price_by_item.json -e atdd/api/environment/localhost_environment.json -d atdd/api/data/wholesaler_update_price_single_poduct_success.json
	
	newman run .\atdd\api\deestone_create_multiple_product_by_upload.json -e .\atdd\api\environment\localhost_environment.json -d .\atdd\api\data\deestone_upload_multiple_products_success.json
	newman run ./atdd/api/Wholesale_delete_product_updated.json -e ./atdd/api/environment/localhost_environment.json -d ./atdd/api/data/wholesale_delete_product_success.json
	newman run ./atdd/api/Regular_Order_create_company.json -e ./atdd/api/environment/localhost_environment.json -d ./atdd/api/data/wholesale_upload_inventory_success.json
accept-dev:
	newman run atdd/api/deestone_create_new_product_manually.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/deestone_create_product_manually_success.json 
	newman run atdd/api/deestone_create_new_product_manually.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/deestone_create_product_manually_fail.json
	
	newman run atdd/api/deestone_update_product_price.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/deestone_update_product_success.json
	newman run atdd/api/deestone_update_product_price.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/deestone_update_product_fail.json
	
	newman run atdd/api/deestone_delete_product.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/deestone_delete_product_success.json 
	newman run atdd/api/deestone_delete_product.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/deestone_delete_product_fail.json 

	newman run atdd/api/wholesale_delete_product.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/wholesale_delete_product_fail.json
	newman run atdd/api/wholesale_delete_product.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/wholesale_delete_product_success.json

	newman run atdd/api/wholesaler_update_product_and_price_by_item.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/wholesaler_update_price_single_poduct_fail.json
	newman run atdd/api/wholesaler_update_product_and_price_by_item.json -e atdd/api/environment/dev-server_environment.json -d atdd/api/data/wholesaler_update_price_single_poduct_success.json
