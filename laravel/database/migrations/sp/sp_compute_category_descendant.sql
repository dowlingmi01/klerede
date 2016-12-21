DROP PROCEDURE IF EXISTS sp_compute_category_descendant;
CREATE PROCEDURE sp_compute_category_descendant()
BEGIN
    declare rows integer; 
    
    delete from category_descendant;
    insert   into category_descendant 
      select id, id from category
        union 
      select parent_category_id, id from category;
    

      REPEAT
          insert IGNORE into category_descendant
          select a.category_id, b.descendant_category_id from category_descendant a inner join category_descendant b on a.descendant_category_id = b.category_id where (a.category_id, b.descendant_category_id) not in (select c.category_id, c.descendant_category_id from category_descendant c);
        
          select count(*) INTO rows from category_descendant a inner join category_descendant b on a.descendant_category_id = b.category_id where (a.category_id, b.descendant_category_id) not in (select c.category_id, c.descendant_category_id from category_descendant c);     

      UNTIL rows = 0 END REPEAT;

END;