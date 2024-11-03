package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleRepo extends JpaRepository<Role, Integer> {

    @Query(value = "SELECT * FROM role WHERE id = ?1", nativeQuery = true)
    Role findById(int id);
}
