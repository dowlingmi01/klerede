CREATE TRIGGER trg_ins_cat_des AFTER  INSERT ON category
    FOR EACH ROW
    BEGIN
      INSERT INTO category_descendant(category_id, descendant_category_id)  VALUES (NEW.parent_category_id, NEW.id) ;
    END;
    
CREATE TRIGGER trg_upd_cat_des BEFORE UPDATE ON category
    FOR EACH ROW
    BEGIN
      UPDATE category_descendant set category_id = NEW.parent_category_id, descendant_category_id = NEW.id where category_id = OLD.parent_category_id and descendant_category_id = OLD.id;
    END;    
    

CREATE TRIGGER trg_del_cat_des BEFORE DELETE ON category
    FOR EACH ROW
    BEGIN
      DELETE FROM category_descendant WHERE category_id = OLD.parent_category_id and descendant_category_id = OLD.id ;
    END;   