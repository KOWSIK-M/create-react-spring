package com.sec.secgroovygradle.model

import jakarta.persistence.*
import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

@Entity
@Table(name = "users")
@ToString
@EqualsAndHashCode
class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id
    
    @Column(nullable = false)
    String name
    
    @Column(unique = true, nullable = false)
    String email
}
