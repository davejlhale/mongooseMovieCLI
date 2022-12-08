# mongooseMovieCLI

database of
title
actor
director
rating

also autogenerates a createdAT and updatedAt fields when either action occurs

to use 

--flag "query string" --field "value"

flags are 
--create
--query
--update
--delete

fields are 
--title
--actor
--director
--rating

query string needs to be "key:value,key:value"  
the keys being 1 to 4 of the flags (without the --)
the values - user defined - doesnt mean it'll be in the database for query/delete/update!!

examples.

--query all //to see all current entries
--query "query string" //to filter entries

use --create to create an entry with
--title "<title>" --actor "<actors name>" --director "<director>" --rating "<rating>"

use --query to find records/documents
node src/app.js --query all
node src/app.gs --query "title:shrek,actor:simon pegg"
node src/app.gs --query "key:value,........,key:value" 

use --update to update any matching records to the query string with new values supplied
node src/app.gs --update "title:titletofind,actor:nametofind" --title "new title" --actor "new actor"

use
--delete all
--delete "title:titletofilm"

